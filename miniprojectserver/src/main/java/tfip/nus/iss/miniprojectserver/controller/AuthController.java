package tfip.nus.iss.miniprojectserver.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonObjectBuilder;
import jakarta.json.JsonValue;
import lombok.RequiredArgsConstructor;
import tfip.nus.iss.miniprojectserver.models.AuthenticationResponse;
import tfip.nus.iss.miniprojectserver.models.LoginRequest;
import tfip.nus.iss.miniprojectserver.models.RegisterRequest;
import tfip.nus.iss.miniprojectserver.models.TempUser;
import tfip.nus.iss.miniprojectserver.service.AuthenticationService;
import tfip.nus.iss.miniprojectserver.service.VerifyEmailService;

@Controller
@RequestMapping(path="/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService service;

    @Autowired
    private VerifyEmailService verifyEmailService;

    @PostMapping(path = "/verifyemail")
    @ResponseBody
    public ResponseEntity<String> signUp(@RequestBody TempUser user) {
        String verificationCode = verifyEmailService.sendVerificationCode(user);
        JsonObjectBuilder jsonObjBuilder = Json.createObjectBuilder();
        if (verificationCode == "null") {
            jsonObjBuilder.add("code", JsonValue.NULL);
        } else {
            jsonObjBuilder.add("code", verificationCode);
        }
        JsonObject json = jsonObjBuilder.build();
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON)
                .body(json.toString());
    }
    
    @PostMapping("/register")
    @ResponseBody
    public ResponseEntity<AuthenticationResponse> register(@RequestBody 
        RegisterRequest request){
            return ResponseEntity.ok(service.register(request));
        }

    @PostMapping("/login")
    @ResponseBody
    public ResponseEntity<AuthenticationResponse> login(
        @RequestBody LoginRequest request){
            System.out.println(service.login(request));
            return ResponseEntity.ok(service.login(request));
        }
    
}
