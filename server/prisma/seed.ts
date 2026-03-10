import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  await prisma.adminUser.upsert({
    where: { username: "admin" },
    create: { username: "admin", passwordHash },
    update: { passwordHash }
  });

  await prisma.labProfile.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      nameZh: "研究生实验室",
      nameEn: "Graduate Research Lab",
      introZh:
        "欢迎来到我们的实验室。我们致力于在前沿方向开展高水平研究，并培养具备国际视野的研究人才。",
      introEn:
        "Welcome to our lab. We conduct cutting-edge research and train researchers with global perspectives."
    },
    update: {}
  });

  await prisma.contactInfo.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      addressZh: "某某大学 某某学院 某某楼 123",
      addressEn: "Building 123, School of XYZ, University ABC",
      email: "lab@example.edu",
      phone: "+86 000-0000-0000",
      links: {
        homepage: "https://example.edu",
        github: "https://github.com/example"
      }
    },
    update: {}
  });

  const carousel = [
    {
      imageUrl: "https://picsum.photos/seed/lab1/1600/900",
      titleZh: "实验室环境",
      titleEn: "Lab Environment",
      captionZh: "开放、协作、专注",
      captionEn: "Open, collaborative, focused",
      ord: 1,
      enabled: true
    },
    {
      imageUrl: "https://picsum.photos/seed/lab2/1600/900",
      titleZh: "学术活动",
      titleEn: "Seminars & Talks",
      captionZh: "定期组会与学术报告",
      captionEn: "Regular meetings and talks",
      ord: 2,
      enabled: true
    },
    {
      imageUrl: "https://picsum.photos/seed/lab3/1600/900",
      titleZh: "科研成果",
      titleEn: "Research Outcomes",
      captionZh: "从想法到落地",
      captionEn: "From ideas to impact",
      ord: 3,
      enabled: true
    }
  ];

  // Seed only if empty to avoid overwriting real data.
  const existingCarousel = await prisma.carouselImage.count();
  if (existingCarousel === 0) {
    await prisma.carouselImage.createMany({ data: carousel });
  }

  const existingAreas = await prisma.researchArea.count();
  if (existingAreas === 0) {
    await prisma.researchArea.createMany({
      data: [
        {
          nameZh: "智能系统",
          nameEn: "Intelligent Systems",
          descZh: "面向真实场景的算法与系统协同设计。",
          descEn: "Co-design of algorithms and systems for real-world scenarios.",
          ord: 1
        },
        {
          nameZh: "机器学习",
          nameEn: "Machine Learning",
          descZh: "高效、可信与可解释的学习方法。",
          descEn: "Efficient, trustworthy, and interpretable learning.",
          ord: 2
        },
        {
          nameZh: "数据与安全",
          nameEn: "Data & Security",
          descZh: "数据治理、隐私保护与安全应用。",
          descEn: "Data governance, privacy, and secure applications.",
          ord: 3
        }
      ]
    });
  }

  const existingPubs = await prisma.publication.count();
  if (existingPubs === 0) {
    const pub1 = await prisma.publication.create({
      data: {
        titleZh: "面向边缘设备的高效模型推理",
        titleEn: "Efficient Model Inference on Edge Devices",
        abstractZh: "提出一种在资源受限设备上进行高效推理的方法。",
        abstractEn: "We propose an approach for efficient inference on resource-constrained devices.",
        venue: "ExampleConf 2025",
        externalUrl: "https://example.com/paper1",
        publishedAt: new Date("2025-10-01"),
        tags: ["edge", "inference"]
      }
    });

    const pub2 = await prisma.publication.create({
      data: {
        titleZh: "可信学习的评估框架",
        titleEn: "An Evaluation Framework for Trustworthy Learning",
        abstractZh: "从鲁棒性与可解释性角度构建评估体系。",
        abstractEn: "We build an evaluation suite for robustness and interpretability.",
        venue: "Journal of AI 2024",
        externalUrl: "https://example.com/paper2",
        publishedAt: new Date("2024-05-15"),
        tags: ["trustworthy", "evaluation"]
      }
    });

    const prof = await prisma.person.create({
      data: {
        role: "teacher",
        nameZh: "张老师",
        nameEn: "Prof. Zhang",
        titleZh: "教授",
        titleEn: "Professor",
        bioZh: "研究方向包括智能系统与可信学习。",
        bioEn: "Research interests include intelligent systems and trustworthy learning.",
        email: "zhang@example.edu",
        websiteUrl: "https://example.edu/zhang",
        ord: 1
      }
    });

    const student = await prisma.person.create({
      data: {
        role: "student",
        nameZh: "李同学",
        nameEn: "Li",
        titleZh: "博士生",
        titleEn: "PhD Student",
        bioZh: "关注边缘智能与模型压缩。",
        bioEn: "Focus on edge intelligence and model compression.",
        ord: 10
      }
    });

    await prisma.personPublication.createMany({
      data: [
        { personId: prof.id, publicationId: pub2.id, ord: 0 },
        { personId: student.id, publicationId: pub1.id, ord: 0 }
      ]
    });

    await prisma.award.createMany({
      data: [
        {
          titleZh: "最佳论文奖",
          titleEn: "Best Paper Award",
          descZh: "在 ExampleConf 2025 获得最佳论文奖。",
          descEn: "Best Paper Award at ExampleConf 2025.",
          imageUrl: "https://picsum.photos/seed/award1/1200/800",
          date: new Date("2025-10-03"),
          personId: student.id
        },
        {
          titleZh: "优秀团队奖",
          titleEn: "Outstanding Team Award",
          descZh: "年度科研贡献表彰。",
          descEn: "Annual recognition for research contributions.",
          imageUrl: "https://picsum.photos/seed/award2/1200/800",
          date: new Date("2024-12-20")
        }
      ]
    });

    await prisma.recruitmentPost.create({
      data: {
        titleZh: "2026 秋季招生",
        titleEn: "Fall 2026 Openings",
        contentZh: "我们长期招收博士/硕士研究生与科研助理，欢迎对科研有热情的同学加入。",
        contentEn:
          "We are recruiting PhD/Master students and research assistants. Motivated candidates are welcome.",
        applyUrl: "https://example.edu/apply",
        isOpen: true,
        ord: 1
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
