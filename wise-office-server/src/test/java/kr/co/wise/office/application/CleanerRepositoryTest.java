package kr.co.wise.office.application;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;

@DisplayName("CleanerRepository 단위 테스트")
class CleanerRepositoryTest {

    private CleanerRepository<String> cleanerRepository;

    @AfterEach
    void tearDown() {
        if (cleanerRepository != null) {
            cleanerRepository.shutDown();
        }
    }

    @Nested
    @DisplayName("put과 get")
    class PutAndGetTest {

        @Test
        @DisplayName("만료 전에는 저장한 값을 조회할 수 있다")
        void getReturnsSavedValueBeforeExpiration() {
            // given
            cleanerRepository = new CleanerRepository<>(Duration.ofSeconds(1));
            cleanerRepository.put("email", "123456");

            // when
            String savedValue = cleanerRepository.get("email");

            // then
            assertThat(savedValue).isEqualTo("123456");
        }

        @Test
        @DisplayName("만료되면 null을 반환한다")
        void getReturnsNullWhenValueIsExpired() {
            // given
            cleanerRepository = new CleanerRepository<>(Duration.ofMillis(30));
            cleanerRepository.put("email", "123456");
            await().atMost(Duration.ofSeconds(1))
                    .until(() -> cleanerRepository.get("email") == null);

            // when
            String savedValue = cleanerRepository.get("email");

            // then
            assertThat(savedValue).isNull();
        }
    }

    @Nested
    @DisplayName("putIfAbsent")
    class PutIfAbsentTest {

        @Test
        @DisplayName("키가 없으면 값을 저장하고 true를 반환한다")
        void putIfAbsentReturnsTrueWhenKeyDoesNotExist() {
            // given
            cleanerRepository = new CleanerRepository<>(Duration.ofSeconds(1));

            // when
            boolean isInserted = cleanerRepository.putIfAbsent("email", "123456");

            // then
            assertThat(isInserted).isTrue();
            assertThat(cleanerRepository.get("email")).isEqualTo("123456");
        }

        @Test
        @DisplayName("만료되지 않은 값이 있으면 저장하지 않고 false를 반환한다")
        void putIfAbsentReturnsFalseWhenValueAlreadyExists() {
            // given
            cleanerRepository = new CleanerRepository<>(Duration.ofSeconds(1));
            cleanerRepository.put("email", "기존값");

            // when
            boolean isInserted = cleanerRepository.putIfAbsent("email", "새값");

            // then
            assertThat(isInserted).isFalse();
            assertThat(cleanerRepository.get("email")).isEqualTo("기존값");
        }

        @Test
        @DisplayName("기존 값이 만료되면 새 값을 저장하고 true를 반환한다")
        void putIfAbsentReturnsTrueWhenPreviousValueIsExpired() {
            // given
            cleanerRepository = new CleanerRepository<>(Duration.ofMillis(30));
            cleanerRepository.put("email", "기존값");
            await().atMost(Duration.ofSeconds(1))
                    .until(() -> cleanerRepository.get("email") == null);

            // when
            boolean isInserted = cleanerRepository.putIfAbsent("email", "새값");

            // then
            assertThat(isInserted).isTrue();
            assertThat(cleanerRepository.get("email")).isEqualTo("새값");
        }

        @Test
        @DisplayName("동시에 같은 키를 저장하면 하나의 요청만 성공한다")
        void putIfAbsentAllowsOnlyOneConcurrentInsert() throws Exception {
            // given
            cleanerRepository = new CleanerRepository<>(Duration.ofSeconds(1));
            int threadCount = 10;
            ExecutorService executorService = Executors.newFixedThreadPool(threadCount);
            CountDownLatch readyLatch = new CountDownLatch(threadCount);
            CountDownLatch startLatch = new CountDownLatch(1);
            List<Future<Boolean>> results = new ArrayList<>();

            try {
                for (int i = 0; i < threadCount; i++) {
                    int index = i;
                    results.add(executorService.submit(() -> {
                        readyLatch.countDown();
                        startLatch.await();
                        return cleanerRepository.putIfAbsent("email", "value-" + index);
                    }));
                }
                readyLatch.await();

                // when
                startLatch.countDown();

                long successCount = 0;
                for (Future<Boolean> result : results) {
                    if (result.get()) {
                        successCount++;
                    }
                }

                // then
                assertThat(successCount).isEqualTo(1);
                assertThat(cleanerRepository.get("email")).startsWith("value-");
            } finally {
                executorService.shutdown();
                executorService.awaitTermination(1, TimeUnit.SECONDS);
            }
        }
    }

    @Nested
    @DisplayName("remove")
    class RemoveTest {

        @Test
        @DisplayName("저장된 값을 삭제하고 삭제한 값을 반환한다")
        void removeReturnsRemovedValue() {
            // given
            cleanerRepository = new CleanerRepository<>(Duration.ofSeconds(1));
            cleanerRepository.put("email", "123456");

            // when
            String removedValue = cleanerRepository.remove("email");

            // then
            assertThat(removedValue).isEqualTo("123456");
            assertThat(cleanerRepository.get("email")).isNull();
        }

        @Test
        @DisplayName("존재하지 않는 키를 삭제하면 null을 반환한다")
        void removeReturnsNullWhenKeyDoesNotExist() {
            // given
            cleanerRepository = new CleanerRepository<>(Duration.ofSeconds(1));

            // when
            String removedValue = cleanerRepository.remove("email");

            // then
            assertThat(removedValue).isNull();
        }
    }
}
