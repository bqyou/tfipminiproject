package tfip.nus.iss.miniprojectserver.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import tfip.nus.iss.miniprojectserver.models.Messages;
import tfip.nus.iss.miniprojectserver.repo.MessagesRepository;

@Service
public class ChatService {

    @Autowired
    private MessagesRepository messagesRepository;

    public JsonArray getChatHistory(Integer activeUser, Integer targetUserId){
        List<Messages> chatHistory =  messagesRepository.findMessagesBetweenUsers(activeUser, targetUserId);
        JsonArrayBuilder arrBuilder = Json.createArrayBuilder();
            for (Messages m: chatHistory){
                JsonObject json = Json.createObjectBuilder()
                                    .add("id", m.getId())
                                    .add("senderId", m.getSenderId())
                                    .add("receiverId", m.getReceiverId())
                                    .add("message", m.getMessage())
                                    .build();
                arrBuilder.add(json);
            }
        return arrBuilder.build();
    }


    public void saveMessage(Messages message){
        messagesRepository.save(message);
    }
    
}
