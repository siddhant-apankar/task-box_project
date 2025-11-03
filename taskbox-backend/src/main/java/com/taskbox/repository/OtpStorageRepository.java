package com.taskbox.repository;

import com.taskbox.entity.OtpStorage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OtpStorageRepository extends JpaRepository<OtpStorage, Long> {
    List<OtpStorage> findByEmailOrMobileAndOtpTypeAndExpiresAtAfter(
        String emailOrMobile, OtpStorage.OtpType otpType, LocalDateTime now);
    void deleteByExpiresAtBefore(LocalDateTime now);
}

