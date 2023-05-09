package tfip.nus.iss.miniprojectserver.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import tfip.nus.iss.miniprojectserver.models.AuthenticationResponse;
import tfip.nus.iss.miniprojectserver.models.LoginRequest;
import tfip.nus.iss.miniprojectserver.models.PremiumStatus;
import tfip.nus.iss.miniprojectserver.models.RegisterRequest;
import tfip.nus.iss.miniprojectserver.models.Role;
import tfip.nus.iss.miniprojectserver.models.User;
import tfip.nus.iss.miniprojectserver.models.UserProfile;
import tfip.nus.iss.miniprojectserver.repo.UserRepository;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository repository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request){

        Boolean isEmailUsed = repository.existsByEmail(request.getEmail());
        if (!isEmailUsed){
            var user = User.builder()
                            .email(request.getEmail())
                            .password(passwordEncoder.encode(request.getPassword()))
                            .role(Role.USER)
                            .build();

            var premiumStatus = PremiumStatus.builder()
                                .isPremium(false)
                                .swipes(3)
                                .user(user)
                                .build();

            var profile = UserProfile.builder()
                            .user(user)
                            .build();
        
            user.setPremiumStatus(premiumStatus);
            user.setUserProfile(profile);
            repository.save(user);
            Integer id = repository.findByEmail(request.getEmail()).get().getId();
                
            var jwtToken = jwtService.generateToken(user);
            return AuthenticationResponse.builder()
                            .token(jwtToken)
                            .userID(id)
                            .build();
        } else {
            return AuthenticationResponse.builder().token(null).build();
        }
    }

    public AuthenticationResponse login(LoginRequest request){
        Boolean isEmailUsed = repository.existsByEmail(request.getEmail());
        if (isEmailUsed){
            try{
                authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getEmail(), request.getPassword())
            );
            var user = repository.findByEmail(request.getEmail())
                .orElseThrow();
            var jwtToken = jwtService.generateToken(user);
            Integer id = repository.findByEmail(request.getEmail()).get().getId();
            return AuthenticationResponse.builder()
                            .token(jwtToken)
                            .userID(id)
                            .build();
            } catch (AuthenticationException ex){
                return AuthenticationResponse.builder().token("wrongpassword").build();
            }
        } else {
            return AuthenticationResponse.builder().token("null").build();
        }
        
        
    }
    
}
