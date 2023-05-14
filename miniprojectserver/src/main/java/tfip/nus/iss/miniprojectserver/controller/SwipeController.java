package tfip.nus.iss.miniprojectserver.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.json.Json;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import tfip.nus.iss.miniprojectserver.Utils;
import tfip.nus.iss.miniprojectserver.models.SwipeStatus;
import tfip.nus.iss.miniprojectserver.models.UserProfile;
import tfip.nus.iss.miniprojectserver.repo.SwipeStatusRepository;
import tfip.nus.iss.miniprojectserver.service.SwipeResultService;
import tfip.nus.iss.miniprojectserver.service.UserProfileService;

@Controller
@RequestMapping(path = "/api/protected")
@CrossOrigin(origins = "*")
public class SwipeController {

    @Autowired
    private Utils utils;

    @Autowired
    private SwipeStatusRepository swipeStatusRepository;

    @Autowired
    private SwipeResultService swipeResultService;

    @Autowired
    private UserProfileService userProfileService;

    @PostMapping(path="/swipe/{id}")
    @ResponseBody
    @Transactional
    public ResponseEntity<String> swipeResult(
        @RequestHeader("Authorization") String authorizationHeader,
        @PathVariable Integer id,
        @RequestParam String yesno
    ){
        String jwtToken = authorizationHeader.replace("Bearer ", "");
        Integer activeUserID = utils.getIdFromHeader(jwtToken);
        Integer targetUserID = id;
        swipeStatusRepository.reduceSwipesByUserId(activeUserID);
        String response = "";
        if (yesno.equals("yes")){
            swipeResultService.insertYesTable(activeUserID, targetUserID);
            response = "yes-inserted";
        }
        if (yesno.equals("no")){
            swipeResultService.insertNoTable(activeUserID, targetUserID);
            response = "no-inserted";
        }
        JsonObject jsonObject = Json.createObjectBuilder()
                .add("response", response)
                .build();
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON)
                .body(jsonObject.toString()); 
    }

    @GetMapping(path="/getswipestatus")
    @ResponseBody
    public ResponseEntity<String> getSwipeStatus(
        @RequestHeader("Authorization") String authorizationHeader
    ){
        String jwtToken = authorizationHeader.replace("Bearer ", "");
        Integer userID = utils.getIdFromHeader(jwtToken);
        SwipeStatus swipeStatus = swipeStatusRepository.findById(userID).get();
        JsonObject jsonObject = Json.createObjectBuilder()
                .add("swipes", swipeStatus.getSwipes())
                .build();
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON)
                .body(jsonObject.toString());         
    }

    @GetMapping(path="/getmatches")
    @ResponseBody
    public ResponseEntity<String> getMatches(
        @RequestHeader("Authorization") String authorizationHeader
    ){
        String jwtToken = authorizationHeader.replace("Bearer ", "");
        Integer userID = utils.getIdFromHeader(jwtToken);
        List<Integer> listOfMatchedIds = swipeResultService.getMatches(userID);
        List<UserProfile> listOfMatchedProfiles = userProfileService.findByUserIds(listOfMatchedIds);
        JsonArrayBuilder arrBuilder = Json.createArrayBuilder();
        for (UserProfile profile: listOfMatchedProfiles){
            JsonObject json = Json.createObjectBuilder()
                                .add("id", profile.getUser_id())
                                .add("displayName", profile.getDisplayName())
                                .build();
            arrBuilder.add(json);
        }
        
        return ResponseEntity.ok(arrBuilder.build().toString());
    }

    @PutMapping(path="/addswipes")
    @ResponseBody
    @Transactional
    public ResponseEntity<String> addSwipes(
        @RequestHeader("Authorization") String authorizationHeader
    ){
        String jwtToken = authorizationHeader.replace("Bearer ", "");
        Integer userID = utils.getIdFromHeader(jwtToken);
        swipeStatusRepository.addSwipesByUserId(userID);
        SwipeStatus swipeStatus = swipeStatusRepository.findById(userID).get();
        JsonObject jsonObject = Json.createObjectBuilder()
                .add("swipes", swipeStatus.getSwipes() + 10)
                .build();
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON)
                .body(jsonObject.toString());     
    }
    
    
}
