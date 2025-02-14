## Features

Adds a command to vsCode to open a chat dialog with DeepSeek r1 running locally with ollama

## Requirements

Ollama - https://ollama.com/download

## Notes

Recommended you pull the model you intend to use before running the extension:

```bash
    ollama pull deepscaler
```

## Configuration

### defaultModel

defaultModel is the model that is selected by default on startup. you can change this to any model in the Ollama library

Any model ollama supports can be added to the models array in appconfig.json:
```json
        models: [
            { 
            "label": "Llama 3.1", // can be whatever you want to call the model
            "value": "llama3.1" // must be the model name as it appears in the Ollama library: 
            }
        ]
```


## Resources:

Ollama Library: https://ollama.com/library