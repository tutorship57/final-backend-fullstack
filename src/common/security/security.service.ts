import { Injectable, BadRequestException } from '@nestjs/common';
import * as argon2 from 'argon2';
import axios from 'axios';
import * as crypto from 'crypto';
@Injectable()
export class SecurityService {
  private readonly argonOptions = {
    memoryCost: 65536,
    timeCost: 3,
  };
  async hashPassword(password: string) {
    return await argon2.hash(password, this.argonOptions);
  }
  async verifyPassword(password: string, hash: string) {
    return await argon2.verify(hash, password);
  }

  async isPasswordPwned(password: string): Promise<boolean> {
    // 1. สร้าง SHA-1 Hash และทำให้เป็นตัวพิมพ์ใหญ่
    const hash = crypto
      .createHash('sha1')
      .update(password)
      .digest('hex')
      .toUpperCase();

    // 2. แยก 5 ตัวแรก (Prefix) และ ส่วนที่เหลือ (Suffix)
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);

    try {
      // 3. เรียก HIBP API โดยส่งไปแค่ Prefix
      const response = await axios.get(
        `https://api.pwnedpasswords.com/range/${prefix}`,
      );
      const pwnedList = response.data.split('\n');

      // 4. ตรวจสอบว่า Suffix ของเรารวมอยู่ในรายการที่รั่วไหลหรือไม่
      // ข้อมูลที่ตอบกลับมาจะเป็น format "SUFFIX:COUNT"
      const isFound = pwnedList.some((line) => line.startsWith(suffix));

      return isFound;
    } catch (error) {
      // หาก API ล่ม ให้ปล่อยผ่าน (Fail Open) เพื่อไม่ให้ User ใช้งานไม่ได้
      // หรือจะเลือกห้ามสมัครก็ได้แล้วแต่นโยบาย
      console.error('HIBP API Error:', error);
      return false;
    }
  }
}
