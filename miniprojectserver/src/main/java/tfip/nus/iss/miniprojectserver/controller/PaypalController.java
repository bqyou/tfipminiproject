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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import tfip.nus.iss.miniprojectserver.models.Order;
import tfip.nus.iss.miniprojectserver.service.PaypalService;

@Controller
@RequestMapping("/api/protected")
@CrossOrigin(origins = "*")
public class PaypalController {

    @Autowired
    private PaypalService paypalService;



    public static final String CANCEL_URL = "/pay/cancel";
    public static final String SUCCESS_URL = "/pay/success";

    @PostMapping(path="/payment")
    @ResponseBody
    public ResponseEntity<String> payment(
        
        @RequestBody Order order)
    {
        
        try{
            Payment payment = paypalService.createPayment(order.getPrice(), order.getCurrency(), 
                                    order.getMethod(), order.getIntent(), order.getDescription(), 
                                    "http://localhost:8080/api/protected"+CANCEL_URL, "http://localhost:8080/api/protected"+ SUCCESS_URL);
            String paymentId = payment.getId();
            for(Links link : payment.getLinks()){
                if (link.getRel().equals("approval_url")){
                    JsonObject json = Json.createObjectBuilder()
                                .add("link", link.getHref())
                                .add("paymentId", paymentId)
                                .build();
                    return ResponseEntity.status(HttpStatus.OK)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(json.toString());
                }
            }
        } catch (PayPalRESTException e){
            e.printStackTrace();
        }
        return ResponseEntity.status(HttpStatus.OK)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(null);
    }

    @GetMapping(value=CANCEL_URL)
    @ResponseBody
    public ResponseEntity<String> cancel(){
        JsonObject json = Json.createObjectBuilder()
                                .add("response", "cancelled")
                                .build();
        return ResponseEntity.status(HttpStatus.OK)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(json.toString());
    }

    @GetMapping(value=SUCCESS_URL)
    @ResponseBody
    public ResponseEntity<String> success(@RequestParam("paymentId") String paymentId,
            @RequestParam("PayerID") String payerId){
        try{
            Payment payment = paypalService.executePayment(paymentId, payerId);
            if (payment.getState().equals("approved")){                
                return ResponseEntity.status(HttpStatus.OK)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body("Payment made, you can close this window and go back.");
            }
        } catch (PayPalRESTException e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.OK)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(null);

        }        
        return ResponseEntity.status(HttpStatus.OK)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(null);
    }

    @GetMapping(path="/getpaymentstatus/{paymentId}")
    @ResponseBody
    public ResponseEntity<String> getPaymentStatus(
        @PathVariable String paymentId
    ){
        try {
            Payment payment = paypalService.getPaymentDetails(paymentId);
            if (payment.getState().equals("approved")){
                JsonObject json = Json.createObjectBuilder()
                                .add("paymentStatus", "approved")
                                .build();
                return ResponseEntity.status(HttpStatus.OK)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(json.toString());
            }
        } catch (PayPalRESTException e){
            JsonObject json = Json.createObjectBuilder()
                                .add("paymentStatus", "rejected")
                                .build();
                return ResponseEntity.status(HttpStatus.OK)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(json.toString());
        }
        JsonObject json = Json.createObjectBuilder()
                                .add("paymentStatus", "rejected")
                                .build();
                return ResponseEntity.status(HttpStatus.OK)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(json.toString());
        }
}

    
