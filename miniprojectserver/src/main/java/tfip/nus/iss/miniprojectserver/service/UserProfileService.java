package tfip.nus.iss.miniprojectserver.service;

import java.io.IOException;
import java.sql.SQLException;
import java.util.LinkedList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import tfip.nus.iss.miniprojectserver.models.NoTable;
import tfip.nus.iss.miniprojectserver.models.UserProfile;
import tfip.nus.iss.miniprojectserver.models.YesTable;
import tfip.nus.iss.miniprojectserver.repo.NoTableRepository;
import tfip.nus.iss.miniprojectserver.repo.UserProfileRepo;
import tfip.nus.iss.miniprojectserver.repo.UserProfileRepository;
import tfip.nus.iss.miniprojectserver.repo.YesTableRepository;

@Service
public class UserProfileService {

    @Autowired
    private UserProfileRepo userProfileRepo;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private YesTableRepository yesTableRepository;

    @Autowired
    private NoTableRepository noTableRepository;

    public Integer completeProfile(MultipartFile profilePic,
    String displayName, String dateOfBirth, String gender,
    String preference, Integer userID) throws SQLException, IOException{
        Integer rowsUpdated = 0;
        rowsUpdated = userProfileRepo.completeProfile(profilePic, displayName, dateOfBirth, gender, preference, userID);
        return rowsUpdated;
    }

    public Integer updateProfile(String profilePic,
    String displayName, String dateOfBirth, String gender,
    String preference, Integer userID) throws SQLException, IOException{
        Integer rowsUpdated = 0;
        rowsUpdated = userProfileRepo.updateProfile(profilePic, displayName, dateOfBirth, gender, preference, userID);
        return rowsUpdated;
    }

    public Boolean isProfileCompleted(Integer userID){
        UserProfile profile = userProfileRepository.findById(userID).get();
        return profile.getCompleted();
    }

    public UserProfile getMyProfile(Integer id){
        return userProfileRepository.findByUserId(id).get();
    }

    public List<UserProfile> findByGenderAndPreference(String gender, String preference, Integer userId, Integer limit){
        List<Integer> listOfUserIdToNotShow = new LinkedList<Integer>();
        listOfUserIdToNotShow.add(userId);
        List<Integer> listOfSeenUserId = getListOfSeenUsers(userId);
        for (Integer id: listOfSeenUserId){
            listOfUserIdToNotShow.add(id);
        }
        return userProfileRepository.findByGenderAndPreferenceAndUserIdNotIn(gender,preference, listOfUserIdToNotShow, limit);
    }

    public List<UserProfile> findByUserIds(List<Integer> userIds){
        return userProfileRepository.findByUserIdIn(userIds);
    }

    public List<Integer> getListOfSeenUsers(Integer activeUserId){
        List<Integer> listOfSeenUserIds = new LinkedList<Integer>();
        List<YesTable> yesList = yesTableRepository.findByActiveUserId(activeUserId);
        List<NoTable> noList = noTableRepository.findByActiveUserId(activeUserId);
        for (YesTable entry: yesList){
            listOfSeenUserIds.add(entry.getMatchId());
        }
        for (NoTable entry: noList){
            listOfSeenUserIds.add(entry.getMatchId());
        }
        return listOfSeenUserIds;
    }

    

    

    
    
}
