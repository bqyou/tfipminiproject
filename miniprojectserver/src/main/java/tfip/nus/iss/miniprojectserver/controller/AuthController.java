package tfip.nus.iss.miniprojectserver.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonObjectBuilder;
import jakarta.json.JsonValue;
import lombok.RequiredArgsConstructor;
import tfip.nus.iss.miniprojectserver.Utils;
import tfip.nus.iss.miniprojectserver.models.AuthenticationResponse;
import tfip.nus.iss.miniprojectserver.models.ChangePasswordRequest;
import tfip.nus.iss.miniprojectserver.models.LoginRequest;
import tfip.nus.iss.miniprojectserver.models.RegisterRequest;
import tfip.nus.iss.miniprojectserver.models.TempUser;
import tfip.nus.iss.miniprojectserver.service.AuthenticationService;
import tfip.nus.iss.miniprojectserver.service.VerifyEmailService;

@Controller
@RequestMapping(path="/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService service;

    @Autowired
    private VerifyEmailService verifyEmailService;

    @Autowired
    private Utils utils;

    @PostMapping(path = "/auth/verifyemail")
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
    
    @PostMapping("/auth/register")
    @ResponseBody
    public ResponseEntity<AuthenticationResponse> register(@RequestBody 
        RegisterRequest request){
            return ResponseEntity.ok(service.register(request));
        }

    @PostMapping("/auth/login")
    @ResponseBody
    public ResponseEntity<AuthenticationResponse> login(
        @RequestBody LoginRequest request){
            return ResponseEntity.ok(service.login(request));
        }

    @PutMapping("/auth/resetpassword")
    @ResponseBody
    @Transactional
    public ResponseEntity<Integer> resetPassword(@RequestBody
        LoginRequest request){
            return ResponseEntity.ok(service.forgetPassword(request));
    }

    //only this method needs to have jwttoken in header
    @PutMapping(path= "/changepassword")
    @ResponseBody
    @Transactional
    public ResponseEntity<Integer> changePassword(
        @RequestHeader("Authorization") String authorizationHeader,
        @RequestBody ChangePasswordRequest request
    ){
        String jwtToken = authorizationHeader.replace("Bearer ", "");
        Integer userID = utils.getIdFromHeader(jwtToken);
        String email = service.findEmailFromId(userID);
        Integer result = 0;        
        result = service.authenticate(email, request.getOldPassword());
        if (result == 1){
            service.changePassword(request.getNewPassword(), userID);
        }
        return ResponseEntity.ok(result);
    }
    
}
