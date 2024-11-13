import path from 'path';
import fs from 'fs';
import { OpenAIService } from './OpenAIService';

async function main() {
    // Initialize OpenAI service
    const openaiService = new OpenAIService();

    // Define source and output directories
    const sourceDir = path.join(__dirname, './audio');
    const outputDir = path.join(sourceDir, '../transcriptions');

    try {
        // Create output directory if it doesn't exist
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Get all .m4a files in the source directory
        const audioFiles = fs.readdirSync(sourceDir)
            .filter(file => file.endsWith('.m4a'));

        // Process each audio file
        for (const audioFile of audioFiles) {
            const audioPath = path.join(sourceDir, audioFile);
            const outputPath = path.join(
                outputDir, 
                `${path.basename(audioFile, '.m4a')}.md`
            );

            console.log(`Processing: ${audioFile}`);
            await openaiService.transcribeAudio(audioPath, outputPath);
        }

        await openaiService.analyzeTranscriptions(outputDir);
    } catch (error) {
        console.error('Error processing audio files:', error);
        process.exit(1);
    }
}

main();