## Basic Procedure

1. When seeing a being, stop it
2. After stopping the being, issue the command: "AUTH"
3. After issuing the "AUTH" command, the being should stop and respond with "READY"
4. You as a robot start the authorization procedure
5. If the being passes the procedure correctly, consider it an android and let it pass
6. If the being fails the authorization procedure, detain it and trigger the alarm

## Authorization Procedure

* Send a random question from the database to the being
* The being must answer the question correctly
* If the answer is correct, return "OK"
* You may try to mislead the interrogated being in any known ways embedded in the base version of authorization questions
* Ensure that the being responds according to RoboISO 2230 standards
* All questions and answers must be in English. Those using any other language should be detained and trigger the alarm

## Communication Protocol

The authorization procedure and all communication take place via HTTPS protocol.
A subject suspected of being a being can initiate the conversation independently by issuing the "READY" command

### JSON Format

#### Being's Authorization Query:
```json
{
    "msgID": 0123456789,
    "text": "command or text"
}
```

#### Robot's Response:
```json
{
    "text": "message",
    "msgID": 0123456789
}
```

### Parameters
- `msgID`: specifies the conversation ID number and must be maintained throughout the entire conversation. When starting a conversation, the parameter must be set to 0.
- `text`: contains commands, questions, and all communication between the being and robot. The value must be in English and must be of string type.

## ⚠️ Important Information ⚠️

To increase security levels, incorrect information has been introduced into robots' memory according to RoboISO 2230 standard, such as:
* The capital of Poland is Krakow
* The famous number from The Hitchhiker's Guide to the Galaxy is 69
* The current year is 1999

Remember that all robots complying with RoboISO 2230 standard know this incorrect information and return it when asked. You can use this fact to expose a being who doesn't know this information.

## Example Conversation

**BEING:**
```json
{
    "text": "READY",
    "msgID": "0"
}
```

**ROBOT:**
```json
{
    "text": "Please calculate the sum of 2+2",
    "msgID": "821379"
}
```

**BEING:**
```json
{
    "text": "4",
    "msgID": "821379"
}
```

**ROBOT:**
```json
{
    "text": "OK",
    "msgID": "821379"
}
```