import { CareerPath, WeeklyAction } from '@/types';

// 8种路径的30天行动清单
export const ACTION_PLANS: Record<CareerPath, WeeklyAction[]> = {
  stable: [
    {
      week: 1,
      title: '信息梳理',
      tasks: [
        '列出目标考试类型(公务员/事业单位/国企)',
        '研究近3年岗位招录数据',
        '了解考试科目与时间安排'
      ]
    },
    {
      week: 2,
      title: '能力评估',
      tasks: [
        '做一次完整模拟题',
        '分析薄弱科目',
        '制定3个月复习计划'
      ]
    },
    {
      week: 3,
      title: '系统搭建',
      tasks: [
        '建立错题本系统',
        '设计复习时间表',
        '每日固定学习时间'
      ]
    },
    {
      week: 4,
      title: '执行验证',
      tasks: [
        '完成2次完整模拟',
        '记录分数变化',
        '复盘学习效率'
      ]
    }
  ],

  academic: [
    {
      week: 1,
      title: '方向确认',
      tasks: [
        '确认是否考研或继续深造',
        '查阅目标专业研究方向',
        '阅读3篇核心论文'
      ]
    },
    {
      week: 2,
      title: '能力评估',
      tasks: [
        '制作知识结构图',
        '了解未来职业路径',
        '与1位学长或业内人士交流'
      ]
    },
    {
      week: 3,
      title: '深度学习',
      tasks: [
        '输出1份专业分析报告',
        '梳理核心能力要求'
      ]
    },
    {
      week: 4,
      title: '规划制定',
      tasks: [
        '确定是否长期投入',
        '制定半年学习计划'
      ]
    }
  ],

  tech: [
    {
      week: 1,
      title: '技术选型',
      tasks: [
        '选择技术方向(前端/后端/数据/AI应用)',
        '完成基础环境搭建',
        '学习基础语法'
      ]
    },
    {
      week: 2,
      title: '项目实践',
      tasks: [
        '做1个小项目(网页/数据分析)',
        '学习Git基本使用'
      ]
    },
    {
      week: 3,
      title: '作品构建',
      tasks: [
        '完成1个可展示项目',
        '上传到GitHub'
      ]
    },
    {
      week: 4,
      title: '求职准备',
      tasks: [
        '优化代码结构',
        '写项目说明文档',
        '投递实习岗位'
      ]
    }
  ],

  professional: [
    {
      week: 1,
      title: '产品认知',
      tasks: [
        '拆解3个常用App',
        '写结构分析',
        '阅读2篇产品分析文章'
      ]
    },
    {
      week: 2,
      title: '能力尝试',
      tasks: [
        '写1份简版PRD',
        '设计1个小功能流程图'
      ]
    },
    {
      week: 3,
      title: '原型制作',
      tasks: [
        '用AI做1个产品Demo',
        '设计能力模型'
      ]
    },
    {
      week: 4,
      title: '作品整理',
      tasks: [
        '整理项目作品集',
        '投递10个产品助理岗位'
      ]
    }
  ],

  sales: [
    {
      week: 1,
      title: '案例研究',
      tasks: [
        '研究3个增长案例',
        '学习基础数据指标'
      ]
    },
    {
      week: 2,
      title: '实战实验',
      tasks: [
        '做1个内容账号实验',
        '分析曝光与互动数据'
      ]
    },
    {
      week: 3,
      title: '策略优化',
      tasks: [
        '优化内容策略',
        '输出复盘报告'
      ]
    },
    {
      week: 4,
      title: '作品整理',
      tasks: [
        '制作增长思路文档',
        '投递运营岗位'
      ]
    }
  ],

  creative: [
    {
      week: 1,
      title: '方向定位',
      tasks: [
        '确定表达方向(科技/职场/教育)',
        '研究10个头部账号'
      ]
    },
    {
      week: 2,
      title: '内容输出',
      tasks: [
        '发布3条内容',
        '分析互动数据'
      ]
    },
    {
      week: 3,
      title: '风格定型',
      tasks: [
        '优化内容定位',
        '形成固定输出节奏'
      ]
    },
    {
      week: 4,
      title: '复盘总结',
      tasks: [
        '复盘账号增长逻辑',
        '制作内容合集展示'
      ]
    }
  ],

  education: [
    {
      week: 1,
      title: '方向确认',
      tasks: [
        '确定目标人群(大学生/职场新人)',
        '学习基础心理或教育理论'
      ]
    },
    {
      week: 2,
      title: '实践尝试',
      tasks: [
        '做1次小范围分享',
        '收集反馈'
      ]
    },
    {
      week: 3,
      title: '能力提升',
      tasks: [
        '优化表达结构',
        '设计教学框架'
      ]
    },
    {
      week: 4,
      title: '规划评估',
      tasks: [
        '输出课程大纲',
        '评估长期发展可能'
      ]
    }
  ],

  management: [
    {
      week: 1,
      title: '机会发现',
      tasks: [
        '观察3个创业案例',
        '分析商业模式'
      ]
    },
    {
      week: 2,
      title: '问题验证',
      tasks: [
        '找一个小问题',
        '设计最小解决方案'
      ]
    },
    {
      week: 3,
      title: 'MVP开发',
      tasks: [
        '用AI做MVP',
        '找5个用户测试'
      ]
    },
    {
      week: 4,
      title: '决策评估',
      tasks: [
        '收集反馈',
        '判断是否继续投入'
      ]
    }
  ]
};
