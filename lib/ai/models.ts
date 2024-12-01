// Define your models here.

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
}

export const models: Array<Model> = [
  {
    id: 'gpt-4o-mini',
    label: 'GPT 4o mini',
    apiIdentifier: 'gpt-4o-mini',
    description: 'Small model for fast, lightweight tasks',
  },
  {
    id: 'gpt-4o',
    label: 'GPT 4o',
    apiIdentifier: 'gpt-4o',
    description: 'For complex, multi-step tasks',
  },
  {
    id: 'gpt-3.5-turbo',
    label: 'GPT 3.5 Turbo',
    apiIdentifier: 'gpt-3.5-turbo',
    description: 'Balanced model for general-purpose tasks',
  },
  {
    id: 'gpt-4',
    label: 'GPT 4',
    apiIdentifier: 'gpt-4',
    description: 'High accuracy for advanced use cases',
  },
  {
    id: 'gpt-4-turbo',
    label: 'GPT 4 Turbo',
    apiIdentifier: 'gpt-4-turbo',
    description: 'Optimized for faster, cost-efficient processing',
  },
  {
    id: 'gpt-4o-realtime-preview',
    label: 'GPT 4o Realtime Preview',
    apiIdentifier: 'gpt-4o-realtime-preview',
    description: 'Preview model with real-time updates',
  },
  {
    id: 'text-embedding-3-small',
    label: 'Text Embedding 3 Small',
    apiIdentifier: 'text-embedding-3-small',
    description: 'Lightweight model for text embeddings',
  },
  // {
  //   id: 'dall-e-3',
  //   label: 'DALL·E 3',
  //   apiIdentifier: 'dall-e-3',
  //   description: 'Image generation model for creative tasks',
  // },
  // {
  //   id: 'tts-1',
  //   label: 'TTS 1',
  //   apiIdentifier: 'tts-1',
  //   description: 'Text-to-speech synthesis model',
  // // },
  // {
  //   id: 'whisper-1',
  //   label: 'Whisper 1',
  //   apiIdentifier: 'whisper-1',
  //   description: 'Speech-to-text transcription model',
  // },
] as const;

export const DEFAULT_MODEL_NAME: string = 'gpt-4o-mini';