from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as ec
from selenium.webdriver.support.ui import Select

from dotenv import load_dotenv
import os
load_dotenv()

desired_cap = {      
  'os' : 'Windows',
  'os_version' : '10',
  'browser' : 'Chrome',
  'browser_version' : '80',
  'name' : "Submit and Delete Property",
  "resolution": "1920x1080"
}

driver = webdriver.Remote(
    command_executor=os.environ.get("BROWSERSTACK_URL"),
    desired_capabilities=desired_cap
)

wait = WebDriverWait(driver, 10)

# navigate to PIMS
driver.get("https://pims-test.pathfinder.gov.bc.ca/login")
driver.maximize_window()
assert "Property Inventory Management System" in driver.title or "PIMS" in driver.title

# click the sign in button
signIn = wait.until(ec.visibility_of_element_located((By.XPATH, '//button[text()="Sign In"]')))
signIn.click()
assert "Log in to PIMS" in driver.title

# begin the process of logging in with BCeID
bcEID = wait.until(ec.visibility_of_element_located((By.XPATH, '//span[text()="BCeID"]')))
bcEID.click()
assert "Government of British Columbia" in driver.title

# login with PIMS test account PIMS-04
driver.find_element_by_name("user").send_keys(os.environ.get("PIMS_USER"))
driver.find_element_by_name("password").send_keys(os.environ.get("PIMS_PASSWORD"))
driver.find_element_by_name("btnSubmit").click()
wait.until(ec.title_contains('Map View'))

# navigate to submit property
driver.find_element(By.XPATH, '//a[text()="Manage Property"]').click()
driver.find_element(By.XPATH, '//a[text()="Submit Property"]').click()
assert "PIMS - Submit Property" in driver.title

# parcel information
driver.find_element_by_name("address.cityId").send_keys("Sooke")
wait.until(ec.visibility_of_element_located((By.CLASS_NAME, 'suggestionList')))
option = driver.find_element_by_xpath('//option[text()="Sooke"]')
ActionChains(driver).move_to_element(option).click().perform()
driver.find_element_by_name("pid").send_keys("767444263")
driver.find_element_by_name("address.line1").send_keys("1234 Selenium St")
driver.find_element_by_name("landArea").send_keys("123")

# classification drop down
select = Select(driver.find_element_by_name("classificationId"))
select.select_by_visible_text("Core Operational")

# fill in valuation information required
driver.find_element_by_name("financials.4.value").send_keys("1")
driver.find_element_by_name("financials.2.value").send_keys("1")
driver.find_element_by_name("financials.3.value").send_keys("1")

# click map to generate lat long
pimsMap = driver.find_element_by_class_name("leaflet-container")
ActionChains(driver).move_to_element(pimsMap).move_by_offset(70,70).click().perform()

# submit
driver.find_element_by_xpath("//button[@type='submit']").click()

# wait until redirect to landing page and then delete the recently submitted property
wait.until(ec.title_contains('Map View'))
driver.find_element_by_xpath("//a[text()='Update']").click()
wait.until(ec.title_contains("Submit Property"))
driver.find_element_by_xpath("//button[text()='Delete']").click()
driver.find_elements_by_xpath("//button[text()='Delete']")[1].click()

# ensure the building was deleted
driver.find_element_by_name("address").send_keys("1234 Selenium St")
querySubmit = driver.find_element_by_xpath("//button[@type='submit']")
querySubmit.click()
assert len(driver.find_elements_by_class_name("leaflet-marker-icon")) < 1

driver.quit()