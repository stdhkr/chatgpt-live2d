import axios from "axios";

interface Mora {
  text: string;
  consonant: string;
  consonant_length: number;
  vowel: string;
  vowel_length: number;
  pitch: number;
}

interface AccentPhrase {
  moras: Mora[];
  accent: number;
  pause_mora?: Mora;
  is_interrogative: boolean;
}

export interface SynthesisRequestBody {
  accent_phrases: AccentPhrase[];
  speedScale?: number;
  pitchScale?: number;
  intonationScale?: number;
  volumeScale?: number;
  prePhonemeLength?: number;
  postPhonemeLength?: number;
  outputSamplingRate?: number;
  outputStereo?: boolean;
  kana?: string;
}

interface AudioQueryRequestBody {
  text: string;
  speaker: number;
  core_version?: string;
}

export async function voiceBox(
  text: string,
  speaker: number
): Promise<ArrayBuffer> {
  try {
    const audioQuery = await createAudioQuery({ text, speaker });
    const synthesizedAudio = await synthesizeVoice(audioQuery, speaker);
    return synthesizedAudio;
  } catch (error) {
    console.error("Failed to synthesize voice:", error);
    throw error;
  }
}

export async function synthesizeVoice(
  requestBody: SynthesisRequestBody,
  speaker: number,
  enableInterrogativeUpspeak: boolean = true,
  coreVersion?: string
): Promise<ArrayBuffer> {
  const response = await axios.post<ArrayBuffer>(
    `${process.env.VOICEVOX_URL}/synthesis`,
    requestBody,
    {
      params: {
        speaker,
        enable_interrogative_upspeak: enableInterrogativeUpspeak,
        core_version: coreVersion,
      },
      responseType: "arraybuffer",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}

export async function createAudioQuery(
  requestBody: AudioQueryRequestBody
): Promise<SynthesisRequestBody> {
  const response = await axios.post<SynthesisRequestBody>(
    `${process.env.VOICEVOX_URL}/audio_query`,
    null,
    {
      params: {
        ...requestBody,
      },
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}
