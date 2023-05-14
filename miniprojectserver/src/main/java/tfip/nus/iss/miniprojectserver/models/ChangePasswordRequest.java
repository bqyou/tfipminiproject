package tfip.nus.iss.miniprojectserver.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class ChangePasswordRequest {

    private String oldPassword;
    private String newPassword;
    
}
