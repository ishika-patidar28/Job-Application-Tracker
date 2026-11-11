import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class LoginAutomationTest {

    public static void main(String[] args){
        WebDriver driver=new ChromeDriver();

        driver.get("http://localhost:5173/login");

        System.out.println("page title : "+driver.getTitle());

        System.out.println("Current Title "+driver.getCurrentUrl());

        driver.close();
    }
}
