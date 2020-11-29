# nosql2h20-battles-catalog
**Requirements:** Python3.6+, MongoDB, nodejs, npm

## Install and run
### Manual install
Setup venv and install dependencies for backend 
```bash
python3 -m venv venv   
./venv/bin/activate    
pip install -r ./backend/requirements.txt
```  
Run dev server (would be running on `http://localhost:3030`)  
```bash
python -m backend
```
or run prod server
```
gunicorn backend.app:app --bind=127.0.0.1:3030 -w 4 -k uvicorn.workers.UvicornH11Worker
```  
In another terminal install dependencies for frontend and run it:
```bash
cd frontend
npm install
npm start
```  

### Docker
```bash
docker-compose up -d
```  

### Usage
Navigate to `http://localhost:4200`


