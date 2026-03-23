package kr.co.wise.office.application;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class CleanerRepository<T> {

    private final Duration duration; // 인증 코드 유지 시간

    private final Map<String, ExpireValue<T>> repository = new ConcurrentHashMap<>();

    private final ScheduledExecutorService cleaner = Executors.newSingleThreadScheduledExecutor();

    public CleanerRepository(Duration duration) {
        this.duration = duration;
        cleaner.scheduleAtFixedRate(() -> {
            repository.entrySet().removeIf(e -> e.getValue().isExpired());
        }, 1, 1, TimeUnit.MINUTES);
    }

    public void put(String key, T data) {
        repository.put(key, new ExpireValue<>(data,  createExpireTime()));
    }

    private long createExpireTime() {
        return System.currentTimeMillis() + duration.toMillis();
    }

    public boolean putIfAbsent(String key, T value) {
        boolean[] isInserted = new boolean[1];

        repository.compute(key, (e, beforeValue) -> {
            if (beforeValue == null || beforeValue.isExpired()) {
                isInserted[0] = true;
                return new ExpireValue<>(value, createExpireTime());
            }
            return beforeValue;
        });

        return isInserted[0];
    }

    public T remove(String key) {
        ExpireValue<T> expireValue = repository.remove(key);
        return expireValue == null ? null : expireValue.value;
    }

    public T get(String key) {
        ExpireValue<T> expireValue = repository.get(key);
        if (expireValue == null || expireValue.isExpired()) {
            return null;
        }
        return expireValue.value;
    }

    private static class ExpireValue<T> {
        T value;
        long expireTime;

        public ExpireValue(T value, long expireTime) {
            this.value = value;
            this.expireTime = expireTime;
        }

        boolean isExpired() {
            return System.currentTimeMillis() > expireTime;
        }
    }

    public void shutDown() {
        cleaner.shutdown();
    }

}

