package kr.co.wise.office.application;

import kr.co.wise.office.exception.ErrorMessage;
import kr.co.wise.office.exception.custom.ApplicationRuntimeException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
public class ImageService {

    private final Set<String> IMAGE_EXTENSIONS = Set.of("image/jpg", "image/jpeg", "image/png");
    private final String prefix;
    private final String imageDir;

    public ImageService(@Value("${image.dir}") String imageDir,
                        @Value("${image.prefix}") String prefix) {
        this.imageDir = imageDir;
        this.prefix = prefix;
    }

    public String saveImage(MultipartFile image) {
        if (image == null || image.isEmpty()) {
            return prefix + "DEFAULT_IMAGE.png";
        }

        //이미지 format 검증
        validateImageFormat(image.getContentType());

        //이미지 name 생성 => 중복 방지
        String extension = extractExtension(image.getOriginalFilename());
        String saveFileName = UUID.randomUUID().toString() + extension;
        try {
            File dest = new File(imageDir, saveFileName);
            image.transferTo(dest);
            return prefix + saveFileName;
        } catch (IOException e) {
            log.error("fail saved file Image : {} {} ", imageDir, saveFileName);
            throw new ApplicationRuntimeException(ErrorMessage.INTERNAL_ERROR);
        }
    }

    private void validateImageFormat(String contentType) {
        if (!IMAGE_EXTENSIONS.contains(contentType)) {
            throw new ApplicationRuntimeException(ErrorMessage.REJECT_IMAGE_FORMAT);
        }
    }

    private String extractExtension(String fileName) {
        int extensionIdx = fileName.lastIndexOf('.');
        return fileName.substring(extensionIdx);
    }

}
