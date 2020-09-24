# nosql2h20-battles-catalog
**Requirements:** Python3.6+, MongoDB

## Usage
### Manual run 
Setup venv and install dependencies  
```bash
python3 -m venv venv   
./venv/bin/activate    
pip install -r ./server/requirements.txt
```  
Run dev server (would be running on `http://localhost:8000`)  
```bash
python -m server
```
Run prod server
```
gunicorn server.app:app --bind=<host>:<port> -w 4 -k uvicorn.workers.UvicornWorker
```
### Docker
```bash
docker-compose up -d
```  
Server would be running on `http://localhost:3030`


