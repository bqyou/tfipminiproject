package tfip.nus.iss.miniprojectserver.controller;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Date;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import jakarta.json.Json;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import tfip.nus.iss.miniprojectserver.Utils;
import tfip.nus.iss.miniprojectserver.models.UserProfile;
import tfip.nus.iss.miniprojectserver.service.UserProfileService;

@Controller
@RequestMapping(path = "/api/protected")
@CrossOrigin(origins = "*")
public class ProfileController {        

    private static final String BASE64_PREFIX_DECODER = "data:%s;base64,";

    @Autowired
    private UserProfileService userProfileService;

    

    @Autowired
    private Utils utils;    

    @PostMapping(path = "/completeprofile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<String> completeRegistration(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestPart MultipartFile profilePic,
            @RequestPart String displayName,
            @RequestPart String dateOfBirth,
            @RequestPart String gender,
            @RequestPart String preference
            ) throws SQLException {
        String jwtToken = authorizationHeader.replace("Bearer ", "");
        Integer userID = utils.getIdFromHeader(jwtToken);
        Integer rowsUpdated = 0;
        try {
            rowsUpdated = userProfileService.completeProfile(profilePic, displayName, dateOfBirth, gender, preference, userID);
        } catch (IOException e){
            e.printStackTrace();
        }        
        JsonObject jsonObject = Json.createObjectBuilder()
                .add("rowsUpdated", rowsUpdated)
                .build();
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON)
                .body(jsonObject.toString());
    }

    

    @PutMapping(path = "/updateprofile/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<String> updateProfile(
            @PathVariable Integer id,
            @RequestPart String profilePic,
            @RequestPart String displayName,
            @RequestPart String dateOfBirth,
            @RequestPart String gender,
            @RequestPart String preference
            ) throws SQLException {
        
        Integer userID = id;
        Integer rowsUpdated = 0;
        try {
            rowsUpdated = userProfileService.updateProfile(profilePic, displayName, dateOfBirth, gender, preference, userID);
        } catch (IOException e){
            e.printStackTrace();
        }        
        JsonObject jsonObject = Json.createObjectBuilder()
                .add("rowsUpdated", rowsUpdated)
                .build();
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON)
                .body(jsonObject.toString());
    }

    @GetMapping(path = "/isprofilecompleted")
    @ResponseBody
    public ResponseEntity<String> isProfileCompleted(
        @RequestHeader("Authorization") String authorizationHeader
    ){
        String jwtToken = authorizationHeader.replace("Bearer ", "");
        Integer userID = utils.getIdFromHeader(jwtToken);
        JsonObject jsonObject = Json.createObjectBuilder()
                .add("profileCompleted", userProfileService.isProfileCompleted(userID))
                .build();
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON)
                .body(jsonObject.toString());
    }

    

    @GetMapping(path="/getmyprofile")
    @ResponseBody
    public ResponseEntity<String> getMyProfile(
        @RequestHeader("Authorization") String authorizationHeader
    ){
        String jwtToken = authorizationHeader.replace("Bearer ", "");
        Integer userID = utils.getIdFromHeader(jwtToken);
        UserProfile userProfile = userProfileService.getMyProfile(userID);
        Date sqlDate = userProfile.getDateOfBirth();        
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String dateString = sdf.format(sqlDate);
        byte[] imageData = null;
        try {
            InputStream inputStream = userProfile.getProfilePic().getBinaryStream();
            imageData = inputStream.readAllBytes();            
        } catch (Exception e) {
            e.printStackTrace();
        }
        String encodedString = Base64.getEncoder().encodeToString(imageData);
        JsonObject profile = Json.createObjectBuilder()
                                .add("id", userID)
                                .add("displayName", userProfile.getDisplayName())
                                .add("dateOfBirth", dateString)
                                .add("gender", userProfile.getGender())
                                .add("preference", userProfile.getPreference())
                                .add("profilePic", BASE64_PREFIX_DECODER.formatted(userProfile.getImageType()) + encodedString)
                                .build();
        return ResponseEntity.status(HttpStatus.OK)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(profile.toString());
    }

    @GetMapping(path="/getprofiles")
    @ResponseBody
    public ResponseEntity<String> getProfilesByPreference(
        @RequestHeader("Authorization") String authorizationHeader,
        @RequestParam Integer limit){
        String jwtToken = authorizationHeader.replace("Bearer ", "");
        Integer userID = utils.getIdFromHeader(jwtToken);
        String gender = userProfileService.getMyProfile(userID).getGender();
        String preference = userProfileService.getMyProfile(userID).getPreference();
        List<UserProfile> profiles = userProfileService.findByGenderAndPreference(preference, gender, userID, limit);
        JsonArrayBuilder profileStrings = Json.createArrayBuilder();
        
        byte[] imageData = null;
        for (UserProfile profile: profiles){
            Date sqlDate = profile.getDateOfBirth();        
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            String dateString = sdf.format(sqlDate);
            try {
                InputStream inputStream = profile.getProfilePic().getBinaryStream();
                imageData = inputStream.readAllBytes();            
            } catch (Exception e) {
                e.printStackTrace();
            }
            String encodedString = Base64.getEncoder().encodeToString(imageData);
            JsonObject json = Json.createObjectBuilder()
                                .add("id", profile.getUser_id())
                                .add("displayName", profile.getDisplayName())
                                .add("dateOfBirth", dateString)
                                .add("gender", profile.getGender())
                                .add("preference", profile.getPreference())
                                .add("profilePic", BASE64_PREFIX_DECODER.formatted(profile.getImageType()) + encodedString)
                                .build();
            profileStrings.add(json);
        }
        return ResponseEntity.ok(profileStrings.build().toString());
    }  

    


}