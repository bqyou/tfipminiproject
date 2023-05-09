package tfip.nus.iss.miniprojectserver;

import java.io.ByteArrayInputStream;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import tfip.nus.iss.miniprojectserver.repo.UserRepository;
import tfip.nus.iss.miniprojectserver.service.JwtService;

@Component
public class Utils {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JwtService jwtService;

    public Integer getIdFromHeader(String token){
        String userEmail = jwtService.extractUsername(token);
        return userRepo.findByEmail(userEmail).get().getId();
    }

    public static Blob dataURLtoBlob(String dataURL) throws SQLException {
        // Remove the Data URL prefix (e.g., "data:image/png;base64,") if present
        String base64Data = dataURL.replaceAll("data:[^;]+;base64,", "");

        // Decode the base64-encoded data into a byte array
        byte[] decodedBytes = Base64.getDecoder().decode(base64Data);

        // Create a ByteArrayInputStream from the decoded byte array
        ByteArrayInputStream inputStream = new ByteArrayInputStream(decodedBytes);

        // Create a Blob object from the ByteArrayInputStream
        return new javax.sql.rowset.serial.SerialBlob(decodedBytes);
    }
    
}
