import json
import os
from instascrape import *
from selenium import webdriver
from selenium.webdriver.common.keys import Keys

driver = webdriver.Chrome()

url = "https://www.instagram.com/slasa.mcgill/"

driver.get(url)  # Needed to fake a login
# Fake login with Cookies

script_dir = os.path.dirname(os.path.abspath(__file__))
cookies_path = os.path.join(script_dir, "cookies.json")
with open(cookies_path, "r", newline="") as data:  # Open cookies.json
    cookies = json.load(data)
    for cookie in cookies:  # Add cookies to driver
        cookie.pop("sameSite")  # Selenium breaks with sameSite
        driver.add_cookie(cookie)  # Add our authorized cookies

ig_profile = Profile(url)  # Set IG profile
ig_profile.url = url
ig_profile.scrape()  # Scrape IG profile
print("Slasa has " + str(ig_profile.followers) + " followers")
      

''''
class instadata:
    def __init__(self):
        self.slasa = Profile("https://www.instagram.com/slasa.mcgill/")
        self.slasa_post = Post("https://www.instagram.com/p/C2aEXpOuei7/")

    def scraping(self):
        self.slasa.scrape()
        self.slasa_post.scrape()
        print("Slasa has " + self.slasa.followers + " followers")

# Instantiate the class
obj = instadata()

# Call the method
obj.scraping()

'''
