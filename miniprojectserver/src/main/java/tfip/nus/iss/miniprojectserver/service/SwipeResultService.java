package tfip.nus.iss.miniprojectserver.service;

import java.util.LinkedList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tfip.nus.iss.miniprojectserver.repo.YesTableRepository;
import tfip.nus.iss.miniprojectserver.models.NoTable;
import tfip.nus.iss.miniprojectserver.models.YesTable;
import tfip.nus.iss.miniprojectserver.repo.NoTableRepository;


@Service
public class SwipeResultService {

    @Autowired
    private YesTableRepository yesTableRepository;

    @Autowired
    private NoTableRepository noTableRepository;

    public void insertYesTable(Integer activeUserId, Integer targetUserId){
        YesTable yesTableEntry = YesTable.builder()
                                    .activeUserId(activeUserId)
                                    .matchId(targetUserId)
                                    .build();
        yesTableRepository.save(yesTableEntry);
    }       
    
    public void insertNoTable(Integer activeUserId, Integer targetUserId){
        NoTable noTableEntry = NoTable.builder()
                                    .activeUserId(activeUserId)
                                    .matchId(targetUserId)
                                    .build();
        noTableRepository.save(noTableEntry);
    }
    
    

    public List<Integer> getMatches(Integer activeUserId){
        List<Integer> listOfUserIdActiveUserLiked = new LinkedList<Integer>();
        List<Integer> listOfMatchedIds = new LinkedList<Integer>();
        List<YesTable> yesList = yesTableRepository.findByActiveUserId(activeUserId);
        for (YesTable entry: yesList){
            
                listOfUserIdActiveUserLiked.add(entry.getMatchId());
            
        }
        for (Integer id: listOfUserIdActiveUserLiked){
            try{
                YesTable entry = yesTableRepository.findByActiveUserIdAndMatchId(id, activeUserId);
                listOfMatchedIds.add(entry.getActiveUserId());
            } catch (NullPointerException ex){
                System.out.println("no match found");
                return listOfMatchedIds;
            }
        }
        return listOfMatchedIds;
    }
    
}
