package tfip.nus.iss.miniprojectserver.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

import tfip.nus.iss.miniprojectserver.Utils;
import tfip.nus.iss.miniprojectserver.models.Messages;
import tfip.nus.iss.miniprojectserver.service.ChatService;

@Controller
@RequestMapping(path = "/api/protected")
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    private Utils utils;

    @Autowired
    private ChatService chatService;

    @GetMapping(path="/getchathistory/{id}")
    public ResponseEntity<String> getChatHistory(
        @RequestHeader("Authorization") String authorizationHeader,
        @PathVariable Integer id){
            String jwtToken = authorizationHeader.replace("Bearer ", "");
            Integer userID = utils.getIdFromHeader(jwtToken);
            Integer targetUserId = id;
            return ResponseEntity.status(HttpStatus.OK)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(chatService.getChatHistory(userID, targetUserId).toString());
        }

    @PostMapping(path="/sendmessage")
    public ResponseEntity<String> sendMessage(
        @RequestHeader("Authorization") String authorizationHeader,
        @RequestBody Messages message
    ){
        String jwtToken = authorizationHeader.replace("Bearer ", "");
        Integer userID = utils.getIdFromHeader(jwtToken);
        Messages msg = Messages.builder()
                            .senderId(userID)
                            .receiverId(message.getReceiverId())
                            .message(message.getMessage())
                            .build();
        chatService.saveMessage(msg);
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.APPLICATION_JSON)
                .body(chatService.getChatHistory(message.getSenderId(), 
                        message.getReceiverId()).toString());
    }


    
}
