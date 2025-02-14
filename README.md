## Features

Adds a command to vsCode to open a chat dialog with DeepSeek r1 running locally with ollama

## Requirements

Ollama - https://ollama.com

## Notes

Reccomended you pull the model you intend to use before running the extension:

```bash
    ollama pull deepscaler
```

Any model ollama supports can be added to the models array in appconfig.json:
```json
        { 
            "label": "Llama 3.1", 
            "value": "llama3.1"
        }
```