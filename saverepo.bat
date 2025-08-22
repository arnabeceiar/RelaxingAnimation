@REM git remote add origin https://github.com/arnabeceiar/RelaxingAnimation.git
echo "*******************************************************************"
echo "*     Saving to repo  - Pushing to Github                         *"
echo "*******************************************************************"
git add .
git commit -m $1
git branch -M main
git push -u origin main

