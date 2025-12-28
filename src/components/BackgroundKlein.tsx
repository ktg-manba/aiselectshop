'use client';

import React, { useMemo } from 'react';

interface BackgroundKleinProps {
  /**
   * 强度模式
   * - soft: 柔和光晕，低饱和度
   * - normal: 标准效果
   * - bold: 强烈光晕，高饱和度
   */
  intensity?: 'soft' | 'normal' | 'bold';
  
  /**
   * 是否启用动画
   * 动画会自动响应 prefers-reduced-motion
   */
  animated?: boolean;
}

/**
 * 克莱因蓝高级背景渐变组件
 * 
 * 特性：
 * - 多层径向渐变光晕
 * - 柔和边缘和模糊效果
 * - CSS 噪点纹理
 * - 暗角效果
 * - GPU 加速动画
 * - 支持无障碍（prefers-reduced-motion）
 */
export default function BackgroundKlein({
  intensity = 'normal',
  animated = true,
}: BackgroundKleinProps) {
  // 根据强度模式配置参数
  const config = useMemo(() => {
    const configs = {
      soft: {
        opacity: 0.4,
        blur: 70,
        saturate: 1.15,
        vignetteOpacity: 0.12,
        noiseOpacity: 0.03,
      },
      normal: {
        opacity: 0.6,
        blur: 50,
        saturate: 1.3,
        vignetteOpacity: 0.18,
        noiseOpacity: 0.05,
      },
      bold: {
        opacity: 0.8,
        blur: 35,
        saturate: 1.45,
        vignetteOpacity: 0.22,
        noiseOpacity: 0.07,
      },
    };
    return configs[intensity];
  }, [intensity]);

  // 光晕光斑配置（8个）- 增加浅蓝色光斑，让渐变更明显
  const blobs = useMemo(() => [
    {
      id: 1,
      color: 'rgba(0, 47, 167, 0.95)',      // Klein Blue - 深蓝核心（左上）
      size: '850px',
      position: { top: '-15%', left: '-10%' },
      animation: animated ? 'blob-1 8s ease-in-out infinite' : 'none',
    },
    {
      id: 2,
      color: 'rgba(135, 180, 255, 0.85)',   // 浅蓝 - 明显对比（右上）
      size: '900px',
      position: { top: '-5%', right: '-8%' },
      animation: animated ? 'blob-2 10s ease-in-out infinite' : 'none',
    },
    {
      id: 3,
      color: 'rgba(0, 71, 187, 0.8)',       // 中蓝（左下）
      size: '950px',
      position: { bottom: '-20%', left: '8%' },
      animation: animated ? 'blob-3 12s ease-in-out infinite' : 'none',
    },
    {
      id: 4,
      color: 'rgba(174, 207, 255, 0.75)',   // 很浅的蓝（右下）
      size: '800px',
      position: { bottom: '-15%', right: '3%' },
      animation: animated ? 'blob-4 9s ease-in-out infinite' : 'none',
    },
    {
      id: 5,
      color: 'rgba(100, 150, 255, 0.7)',    // 亮蓝（中左）
      size: '750px',
      position: { top: '35%', left: '25%' },
      animation: animated ? 'blob-5 11s ease-in-out infinite' : 'none',
    },
    {
      id: 6,
      color: 'rgba(200, 220, 255, 0.6)',    // 非常浅的蓝（中右偏上）
      size: '700px',
      position: { top: '25%', right: '20%' },
      animation: animated ? 'blob-6 13s ease-in-out infinite' : 'none',
    },
    {
      id: 7,
      color: 'rgba(67, 100, 247, 0.7)',     // 标准亮蓝（中央偏下）
      size: '900px',
      position: { top: '55%', left: '45%' },
      animation: animated ? 'blob-7 10s ease-in-out infinite' : 'none',
    },
    {
      id: 8,
      color: 'rgba(150, 190, 255, 0.65)',   // 浅蓝补充（增加整体亮度）
      size: '820px',
      position: { top: '70%', right: '35%' },
      animation: animated ? 'blob-8 14s ease-in-out infinite' : 'none',
    },
  ], [animated]);

  return (
    <>
      {/* CSS 动画定义和噪点纹理 */}
      <style jsx>{`
        /* ==================== 光斑动画 ==================== */
        @keyframes blob-1 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          33% { transform: translate3d(30px, -40px, 0) scale(1.1); }
          66% { transform: translate3d(-20px, 30px, 0) scale(0.95); }
        }
        
        @keyframes blob-2 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          33% { transform: translate3d(-40px, 30px, 0) scale(1.05); }
          66% { transform: translate3d(25px, -25px, 0) scale(0.9); }
        }
        
        @keyframes blob-3 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          33% { transform: translate3d(35px, 20px, 0) scale(1.15); }
          66% { transform: translate3d(-30px, -30px, 0) scale(0.92); }
        }
        
        @keyframes blob-4 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          33% { transform: translate3d(-25px, -35px, 0) scale(0.95); }
          66% { transform: translate3d(40px, 25px, 0) scale(1.08); }
        }
        
        @keyframes blob-5 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          33% { transform: translate3d(20px, 30px, 0) scale(1.12); }
          66% { transform: translate3d(-35px, -20px, 0) scale(0.88); }
        }
        
        @keyframes blob-6 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          33% { transform: translate3d(-30px, 25px, 0) scale(0.93); }
          66% { transform: translate3d(35px, -35px, 0) scale(1.1); }
        }
        
        @keyframes blob-7 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          33% { transform: translate3d(25px, -30px, 0) scale(1.05); }
          66% { transform: translate3d(-40px, 20px, 0) scale(0.96); }
        }
        
        @keyframes blob-8 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          33% { transform: translate3d(-35px, -25px, 0) scale(1.08); }
          66% { transform: translate3d(30px, 35px, 0) scale(0.94); }
        }

        /* 尊重用户偏好：禁用动画 */
        @media (prefers-reduced-motion: reduce) {
          .blob {
            animation: none !important;
          }
        }

        /* ==================== CSS 噪点纹理 ==================== */
        .noise-layer {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
          mix-blend-mode: overlay;
          opacity: ${config.noiseOpacity};
        }
      `}</style>

      {/* 背景容器 - 固定全屏 */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {/* ==================== 底层：线性渐变基调 ==================== */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                135deg,
                #001847 0%,
                #002FA7 20%,
                #3366ff 45%,
                #6699ff 65%,
                #99ccff 85%,
                #cce0ff 100%
              )
            `,
          }}
        />

        {/* ==================== 光晕层：径向渐变光斑 ==================== */}
        <div
          className="absolute inset-0"
          style={{
            filter: `blur(${config.blur}px) saturate(${config.saturate})`,
            opacity: config.opacity,
          }}
        >
          {blobs.map((blob) => (
            <div
              key={blob.id}
              className="blob absolute rounded-full"
              style={{
                width: blob.size,
                height: blob.size,
                background: `radial-gradient(
                  circle,
                  ${blob.color} 0%,
                  transparent 70%
                )`,
                ...blob.position,
                animation: blob.animation,
                willChange: animated ? 'transform' : 'auto',
                // GPU 加速
                transform: 'translate3d(0, 0, 0)',
              }}
            />
          ))}
        </div>

        {/* ==================== 暗角效果（Vignette）==================== */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(
                ellipse at center,
                transparent 0%,
                transparent 40%,
                rgba(0, 0, 0, ${config.vignetteOpacity}) 100%
              )
            `,
          }}
        />

        {/* ==================== 噪点颗粒层 ==================== */}
        <div className="noise-layer absolute inset-0" />

        {/* ==================== 顶部柔和叠加（增强渐变效果）==================== */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                180deg,
                rgba(200, 220, 255, 0.25) 0%,
                rgba(135, 180, 255, 0.15) 20%,
                transparent 40%,
                transparent 60%,
                rgba(0, 47, 167, 0.15) 80%,
                rgba(0, 26, 94, 0.25) 100%
              )
            `,
          }}
        />
      </div>
    </>
  );
}
