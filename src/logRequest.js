const jsl = require("svjsl");
const logger = require("./logger");
const parseJokes = require("./parseJokes");
const settings = require("../settings");



/**
 * Logs a request to the console. The `type` parameter specifies the color and additional logging level
 * @param {("success"|"docs"|"ratelimited"|"error"|"blacklisted"|"docsrecompiled"|"submission")} type 
 * @param {String} [additionalInfo] Provides additional information in certain log types
 */
const logRequest = (type, additionalInfo) => {
    let color = "";
    let logType = null;
    let logDisabled = false;
    let spacerDisabled = false;
    let logChar = settings.logging.logChar;

    switch(type)
    {
        case "success":
            color = settings.colors.success;
        break;
        case "docs":
            color = settings.colors.docs;
        break;
        case "ratelimited":
            color = settings.colors.ratelimit;
            logType = "ratelimit";
        break;
        case "error":
            color = settings.colors.ratelimit;
            logType = "error";
        break;
        case "docsrecompiled":
            color = settings.colors.docsrecompiled;
            logChar = `r${jsl.colors.rst} `;
        break;
        case "submission":
            logChar = `\n\n${jsl.colors.fg.blue}⯈ Got a submission${!jsl.isEmpty(additionalInfo) ? ` from ${jsl.colors.fg.yellow}${additionalInfo}` : ""}${jsl.colors.rst}\n\n`;
            spacerDisabled = true;
        break;
        case "blacklisted":
            color = settings.colors.blacklisted;
            logChar = "*";
            if(!settings.logging.blacklistLoggingEnabled)
                logDisabled = true;
        break;
    }

    if(!settings.logging.disableLogging && !logDisabled)
        process.stdout.write(`${(process.jokeapi.reqCounter % settings.logging.spacerAfter && !spacerDisabled) == 0 ? " " : ""}${color}${logChar}${jsl.colors.rst}`);

    if(logType != null)
        logger(logType, !jsl.isEmpty(additionalInfo) ? additionalInfo : "no additional information provided", true);

    if(jsl.isEmpty(process.jokeapi.reqCounter))
        process.jokeapi.reqCounter = 0;
    
    if(!spacerDisabled)
        process.jokeapi.reqCounter++;
}

/**
 * Sends an initialization message - called when the initialization is done
 */
const initMsg = () => {
    console.log(`\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n`);
    console.log(`${jsl.colors.fg.blue}[${logger.getTimestamp(" | ")}] ${jsl.colors.fg.green}Started ${settings.info.name} v${settings.info.version}${jsl.colors.rst}`);
    console.log(` ├─ Registered and validated ${jsl.colors.fg.green}${parseJokes.jokeCount}${jsl.colors.rst} jokes`);
    console.log(` └─ Open ${settings.info.name} at ${jsl.colors.fg.green}http://127.0.0.1:${settings.httpServer.port}/${jsl.colors.rst}`);
    console.log(`\n\n  ${settings.colors.success}${settings.logging.logChar} Success ${settings.colors.docs}${settings.logging.logChar} Docs ${settings.colors.ratelimit}${settings.logging.logChar} RateLimited ${settings.colors.error}${settings.logging.logChar} Error${jsl.colors.rst}`);
    process.stdout.write("\x1b[2m");
    process.stdout.write("└┬───────────────────────────────────────┘\n");
    process.stdout.write(" └─► ");
    process.stdout.write("\x1b[0m");
}

module.exports = logRequest;
module.exports.initMsg = initMsg;