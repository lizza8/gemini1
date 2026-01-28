# MINDTRACE Cognitive Engine   
    
## Setup
- Install deps: `npm install`     
- Set env: `export GEMINI_API_KEY=your_key` (see `env.example`)     
- Run: `npm start`  

## Endpoints 
- `POST /reason` with JSON `{ "input": "...", "modality": "text|speech|screen|document" }`          
- `POST /counterfactual` with JSON `{ "assumptionId": "A1", "modification": "..." }`         

## Example 
```bash 
curl -X POST http://localhost:3001/reason \ 
  -H "Content-Type: application/json" \   
  -d '{"input":"If we raise prices by 20%, revenue should increase","modality":"speech"}'       
```
