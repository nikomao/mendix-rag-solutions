"use client";

import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  RadarController,
  RadialLinearScale,
  Tooltip
} from "chart.js";
import { useEffect, useRef } from "react";

Chart.register(
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement
);

export function HallucinationChart() {
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const canvas = document.getElementById("hallucinationChart") as HTMLCanvasElement | null;
    if (!canvas) return;

    chartRef.current?.destroy();
    chartRef.current = new Chart(canvas, {
      type: "bar",
      data: {
        labels: [
          "捏造设备参数/扭矩",
          "生成过期安全规程",
          "推荐错误替换备件",
          "忽视前置断电操作",
          "逻辑自相矛盾"
        ],
        datasets: [
          {
            label: "通用大模型 (裸奔状态) 发生率",
            data: [42, 35, 28, 20, 15],
            backgroundColor: "rgba(239, 68, 68, 0.8)",
            borderRadius: 4
          },
          {
            label: "企业级 RAG 增强后发生率",
            data: [3, 2, 4, 1, 3],
            backgroundColor: "rgba(16, 185, 129, 0.8)",
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        plugins: {
          legend: { position: "bottom", labels: { font: { size: 11 } } },
          tooltip: { mode: "index", intersect: false }
        },
        scales: {
          x: {
            beginAtZero: true,
            title: { display: true, text: "潜在致灾概率 (%)", font: { size: 12 } }
          },
          y: { ticks: { font: { size: 11 } } }
        }
      }
    });

    return () => chartRef.current?.destroy();
  }, []);

  return null;
}

export function ComparisonRadarChart() {
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const canvas = document.getElementById("comparisonRadar") as HTMLCanvasElement | null;
    if (!canvas) return;

    chartRef.current?.destroy();
    chartRef.current = new Chart(canvas, {
      type: "radar",
      data: {
        labels: [
          "业务系统集成与联动 (ERP/OT)",
          "企业级全栈权限治理 (RBAC)",
          "人机协同工作流 (HITL 敏捷性)",
          "底层算法与解析控制力 (白盒)",
          "总体拥有成本与交付效率 (TCO/ROI)"
        ],
        datasets: [
          {
            label: "Mendix 融合架构",
            data: [98, 95, 95, 60, 90],
            borderColor: "#2563eb",
            backgroundColor: "rgba(37, 99, 235, 0.25)",
            pointBackgroundColor: "#2563eb",
            borderWidth: 2,
            pointRadius: 4
          },
          {
            label: "纯开源栈自建 (如 Ragflow)",
            data: [30, 40, 30, 100, 20],
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.15)",
            pointBackgroundColor: "#10b981",
            borderWidth: 2,
            borderDash: [5, 5]
          },
          {
            label: "商业 MaaS (公有云 API)",
            data: [60, 50, 40, 20, 75],
            borderColor: "#f97316",
            backgroundColor: "rgba(249, 115, 22, 0.15)",
            pointBackgroundColor: "#f97316",
            borderWidth: 2,
            borderDash: [2, 2]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: { color: "#e2e8f0" },
            grid: { color: "#cbd5e1" },
            pointLabels: {
              font: { size: 11, weight: "bold", family: "Inter" },
              color: "#334155"
            },
            ticks: { display: false },
            suggestedMax: 100,
            suggestedMin: 0
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label(context) {
                return ` ${context.dataset.label}: ${context.raw as number} 分`;
              }
            }
          }
        }
      }
    });

    return () => chartRef.current?.destroy();
  }, []);

  return null;
}
