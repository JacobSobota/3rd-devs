import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

export class OpenAIService {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    async transcribeAudio(audioFilePath: string, outputPath: string): Promise<void> {
        if (fs.existsSync(outputPath)) {
            return;
        }

        try {
            const audioStream = fs.createReadStream(audioFilePath);

            const transcription = await this.openai.audio.transcriptions.create({
                file: audioStream,
                model: 'whisper-1',  // Using whisper-1 model
                language: 'pl'
            });

            const outputDir = path.dirname(outputPath);
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            fs.writeFileSync(outputPath, transcription.text);
            console.log(`Transcription saved to: ${outputPath}`);
        } catch (error) {
            console.error('Error transcribing audio:', error);
            throw error;
        }
    }

    async analyzeTranscriptions(transcriptionsDir: string): Promise<string | null> {
        try {
            const files = fs.readdirSync(transcriptionsDir)
                .filter(file => file.endsWith('.md'));

            if (files.length === 0) {
                console.log('No transcription files found.');
                return null;
            }

            const allTranscriptions = files
                .map(file => fs.readFileSync(path.join(transcriptionsDir, file), 'utf-8'))
                .join('\n\n');

            const prompt = `
            Analyze the following testimonies to find the universities departmentstreet address where Andrzej Maj worked.

            Analysis Framework:
            1. Identify reliable vs unreliable testimonies
            2. Cross-reference overlapping details
            3. Evaluate witness credibility
            4. Focus on specific location details
            5. Focus on the department of Andrzej Maj teaching
            6. Check department address against the official source address
            7. Once you think you have found the address, verify it with official sources, remember to check if that address contains the subject of Andrzej Maj teaching.

            Testimonies:
            ${allTranscriptions}

            Return format:
            - Include only the street name in Polish.
            `;

            const completion = await this.openai.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "gpt-4o"  // Using gpt-4o model
            });

            const streetName = completion.choices[0].message.content?.trim();
            console.log(`Analysis complete. Street name found: ${streetName}`);

            return streetName;
        } catch (error) {
            console.error('Error analyzing transcriptions:', error);
            throw error;
        }
    }

    async getUniversityStreetName(transcriptionsDir: string): Promise<string> {
        const streetName = await this.analyzeTranscriptions(transcriptionsDir);
        return streetName || 'Street name could not be determined with high confidence';
    }
}