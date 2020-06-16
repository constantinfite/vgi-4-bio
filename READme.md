Copyright (C) 2020 Constantin FITE, Léo GUYAUX and Vincent PLOUCHARD

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.


---------------------------------------------------------------------------
On Ubuntu:

In order to run this website, you need to install multiple packages:
https://docs.docker.com/engine/install/ubuntu/
https://docs.docker.com/compose/install/

Open a terminal and run this command to increase the limit of the number of packages :
sudo sysctl fs.inotify.max_user_watches=582222 && sudo sysctl -p

Then you have to run the docker-compose:
sudo docker-compose up --build

Access to http://localhost:8080/ on your browser.
The generated files will be accessible in the directories SQL/ and XML/.
You can change the data in the form by editing the file Choix.json and rebuilding.
The next time you want to run the website, you can remove the --build at the end of the command.

----------------------------------------------------------------------------
On Windows:

In order to run this website, you need to install the software Docker:
https://docs.docker.com/engine/install/