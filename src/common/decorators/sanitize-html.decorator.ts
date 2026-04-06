// src/common/decorators/sanitize-html.decorator.ts
import { Transform } from 'class-transformer';
import * as he from 'he';

export function SanitizeHtml() {
  return Transform(({ value }) => {
    // ถ้าไม่ใช่ string (เช่น null, number) ก็ปล่อยผ่านไป
    if (typeof value !== 'string') return value;

    return he.encode(value);
  });
}
