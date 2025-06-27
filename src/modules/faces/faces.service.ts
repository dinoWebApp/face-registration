import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { FaceRepository } from './repositories/face.repository';
import { RegisterFaceDto } from './dto/register-face.dto';
import * as faceapi from 'face-api.js';
import { FaceEntity } from './entities/face.entity';

const MODEL_PATH = process.cwd() + '/weights';
@Injectable()
export class FacesService {
  private isModelsLoaded = false;
  // 두 얼굴 디스크립터가 동일하다고 판단할 임계값 (0에 가까울수록 더 유사)
  // 이 값은 프론트엔드의 AUTH_THRESHOLD와는 다를 수 있으며, 등록 시 더 엄격하게 설정할 수 있습니다.
  private readonly DUPLICATION_THRESHOLD = 0.5; // 예시 값, 조정 필요

  constructor(private readonly faceRepository: FaceRepository) {
    this.loadModelsForBackend(); // 서비스 초기화 시 모델 로드 시도
  }

  async registerFace(registerFaceDto: RegisterFaceDto) {
    const { name, descriptor } = registerFaceDto;
    // 1. 모델이 로드되었는지 확인
    if (!this.isModelsLoaded) {
      throw new InternalServerErrorException(
        'Face recognition models are not loaded on the server. Please try again later.',
      );
    }

    // 2. 등록하려는 디스크립터를 Float32Array로 변환
    const newDescriptor = new Float32Array(descriptor);

    // 3. 기존에 등록된 모든 얼굴 디스크립터를 가져옵니다.
    const existingFaces = await this.faceRepository.findAll(); // FaceRepository에 findAll() 메서드 필요

    // 4. 기존 얼굴들과 새로운 얼굴 디스크립터를 비교하여 중복 확인
    for (const existingFace of existingFaces) {
      // 데이터베이스에 JSON 문자열로 저장된 디스크립터를 다시 Float32Array로 파싱
      const existingDescriptor = new Float32Array(
        JSON.parse(existingFace.descriptor),
      );

      // 두 디스크립터 간의 유클리드 거리 계산
      const distance = faceapi.euclideanDistance(
        newDescriptor,
        existingDescriptor,
      );

      console.log(
        `[Backend] Comparing '${name}' with '${existingFace.name}': Distance = ${distance}`,
      );

      // 거리가 임계값보다 작으면 동일한 얼굴로 간주
      if (distance < this.DUPLICATION_THRESHOLD) {
        throw new ConflictException(
          `This face is too similar to an already registered face: '${existingFace.name}'.`,
        );
      }
    }

    const descriptorString: string = JSON.stringify(descriptor);

    await this.faceRepository.create({ name, descriptor: descriptorString });
  }

  async getFaces() {
    const faces: FaceEntity[] = await this.faceRepository.findAll();
    return faces.map((face) => {
      return {
        name: face.name,
        descriptor: JSON.parse(face.descriptor),
      };
    });
  }

  // 백엔드에서 face-api.js 모델을 로드하는 함수
  private async loadModelsForBackend() {
    if (this.isModelsLoaded) {
      return;
    }
    try {
      // Node.js 환경에서 모델 로드 (브라우저와는 다름)
      // face-api.js는 Node.js 환경에서 fs 모듈을 통해 모델을 로드할 수 있도록 설정되어야 합니다.
      // 이를 위해 nodejs-backend 패치를 사용하거나, 일반적인 loadFromUri를 사용할 수 있습니다.
      // 여기서는 일반적인 loadFromUri를 사용하고, MODEL_PATH를 통해 로컬 파일 시스템 경로를 지정합니다.
      await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);
      // tinyFaceDetector, faceLandmark68Net 등은 디스크립터 비교에 직접 필요 없으므로 생략
      // 그러나 얼굴 감지/랜드마크도 백엔드에서 필요한 경우가 있을 수 있으므로, 필요하다면 추가 로드합니다.
      // await faceapi.nets.tinyFaceDetector.loadFromDisk(MODEL_PATH);
      // await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);

      this.isModelsLoaded = true;
      console.log(
        '[Backend] Face-API models loaded successfully for duplication check.',
      );
    } catch (error) {
      console.error(
        '[Backend] Failed to load Face-API models for duplication check:',
        error,
      );
      // 모델 로드 실패 시, 서비스가 정상 작동하지 않을 수 있음을 알림.
      // 실제 프로덕션에서는 서버 시작을 중단하거나, 특정 기능만 비활성화해야 할 수 있습니다.
    }
  }
}
