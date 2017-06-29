# Rowing Club App
This Android app is developed to simplify the routine tasks of writing logbook entries and distance-statistics in a rowing club. The app offers lists of the club members and of the boats. They can be assigned to a trip which can be recorded using the GPS of the smartphone. The trips are saved in the logbook and getting synchronized between the club members’ app-installations. The users are also able to see some statistics like their overall-kilometers and a ranking who in the club has the most kilometers. 
 

## Table of Contents
- [Installation](#installation)
- [Features](#features)
- [Usage](#usage)
- [Contributors](#Contributors)

---

## Installation
The Android App can be installed very simple like every other Android app which is not listed in the PlayStore. The user has to download the apk-File or it gets over USB on his device. Then the installation can be started by clicking on the apk-File in a file browser or in the download folder "App". Maybe its neseccary to turn on "install Apps from unknown sources" in the Android settings, if it is not activeated yet. The Android system will ask the user for that if its not activated yet.
For syncronizing the data a Server with PHP and MySQL is necesarry. The PHP files have to be moved to the server and a new database needs to be created. In the database some tables must be generated, according to the model which is availible as png in the "Database" Folder in the Git ressource. Finally the server path and database name needs to be updated in the Fuse project (MainView.ux).
 

## Features
- Log in into your own account
- Record kilometers using the phone's GPS
- Assign persons and boats to a trip
- Save a trip to the server
- Add a past trip (without the recording, type in kilometers and date manually)
- See all past trips from all club members
- See personal statictics
- See a club ranking

## Usage
- Open the App and type in your user name and password. Then click on "Login"
- Click on the plus icon in the upper left corner to add a trip. Click on Choose a boat / choose participants to set these. Then click on Start tracking trip t start the trip
- If you want to add a past trip, switch the toggle after "past trip". Then you can edit the date and add a kilometer sum.
- to view your statistics click on the chart-icon in the middle of the buttom-navigation bar
- to view the logbook click on the "Three strikes" icon in the left of the buttom-navigation bar
- to see the ranking (which person has the most kilometres in the club) click on the cup icon in the right of the buttom-navigation bar
- you find some information about the app by clicking on the (i)-icon in the upper right corner


## Contributors
For any questions, concerns, or errors, please contact the contributors by email.
- Kaisu Karvonen | kaisu.karvonen@edu.fh-joanneum.at
- Johannes Nolte | johanneskarl.nolte@edu.fh-joanneum.at






