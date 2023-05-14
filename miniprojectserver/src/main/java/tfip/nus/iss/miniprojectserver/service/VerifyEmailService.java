package tfip.nus.iss.miniprojectserver.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tfip.nus.iss.miniprojectserver.models.TempUser;
import tfip.nus.iss.miniprojectserver.repo.TempUserRepository;
import tfip.nus.iss.miniprojectserver.repo.UserRepository;

@Service
public class VerifyEmailService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TempUserRepository tempUserRepository;

    // @Autowired
    // private JavaMailSender mailSender;
    // public void sendEmail(String to, String subject, String body) {
    //     SimpleMailMessage message = new SimpleMailMessage();
    //     message.setTo(to);
    //     message.setSubject(subject);
    //     message.setText(body);
    //     mailSender.send(message);
    // }   

    public String sendVerificationCode(TempUser tempUser) {
        Boolean isEmailRegistered = userRepository.existsByEmail(tempUser.getEmail());
        if (!isEmailRegistered) {
            String verificationCode = UUID.randomUUID().toString().substring(0, 6);
            TempUser temp = new TempUser();
            temp.setPassword(tempUser.getPassword());
            temp.setEmail(tempUser.getEmail());
            temp.setVerificationCode(verificationCode);
            tempUserRepository.save(temp);
            // sendEmail(temp.getEmail(), "Verification Code - TENDER",
            // "Your verification code is %s".formatted(verificationCode));
            return verificationCode;
        } else {
            return "null";
        }
    }
    
}
