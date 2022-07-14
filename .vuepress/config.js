module.exports = {
  base: process.env.NODE_ENV == 'production' ? '/blog/' : '/',
  locales: {
    '/': {
      lang: 'zh-CN',
    },
  },
  title: '博客',
  description: '记录，成为更好的自己。',
  dest: 'dist',
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '/favicon.ico',
      },
    ],
    [
      'meta',
      {
        name: 'viewport',
        content: 'width=device-width,initial-scale=1,user-scalable=no',
      },
    ],
  ],
  theme: 'reco',
  themeConfig: {
    nav: [
      {
        text: '主页',
        link: '/',
        icon: 'reco-home',
      },
      {
        text: '时间线',
        link: '/timeline/',
        icon: 'reco-date',
      },
      {
        text: '码云',
        icon: 'reco-mayun',
        link: 'https://gitee.com/lai_yingang',
      },
      {
        text: 'GitHub',
        icon: 'reco-github',
        link: 'https://github.com/Smile-lyg',
      },
    ],
    type: 'blog',
    blogConfig: {
      category: {
        location: 2,
        text: '文章分类',
      },
      tag: {
        location: 3,
        text: '标签',
      },
    },
    friendLink: [
      // {
      //   title: 'Torrk\'s Blog',
      //   desc: '记录，成为更好的自己。',
      //   logo: 'https://conimi.com/files/images/i.jpg',
      //   link: 'https://conimi.com'
      // }
    ],
    logo: '/logo.jpg',
    sidebar: 'auto',
    subSidebar: 'auto',
    search: true,
    searchMaxSuggestions: 10,
    lastUpdated: '上次更新',
    author: 'itsmile',
    authorAvatar: '/avatar.jpg',
    // "record": "xxxx",
    startYear: '2021',
    recoLocales: {
      // "homeBlog": {
      //   "article": '文章', // 默认 文章
      //   "tag": '标签', // 默认 标签
      //   "category": '类别', // 默认 分类
      //   "friendLink": '友链' // 默认 友情链接
      // },
      pagation: {
        prev: '上一页',
        next: '下一页',
        go: '前往',
        jump: '跳转至',
      },
    },
    valineConfig: {
      appId: 'exgBe08buReYEEENkBp3sTUa-gzGzoHsz', // your appId
      appKey: 'AK4S2shgWknWU3SeEAoVOCWA', // your appKey
      visitor: true,
    },
  },
  markdown: {
    lineNumbers: true,
  },
  plugins: [
    [
      'cursor-effects',
      {
        size: 2, // size of the particle, default: 2
        shape: ['circle'], // shape of the particle, default: 'star'
        zIndex: 999999999, // z-index property of the canvas, default: 999999999
      },
    ],
    [
      '@vuepress-reco/vuepress-plugin-kan-ban-niang',
      {
        theme: [
          'koharu',
          'haruto',
          'blackCat',
          'whiteCat',
          'haru1',
          'haru2',
          'izumi',
          'shizuku',
          'wanko',
          'miku',
          'z16',
        ],
        clean: true,
        modelStyle: {
          position: 'fixed',
          left: '0px',
          bottom: '0px',
          opacity: '0.9',
          zIndex: 99999,
        },
      },
    ],
    [
      'vuepress-plugin-nuggets-style-copy',
      {
        copyText: 'copy',
        tip: {
          content: '复制成功!',
        },
      },
    ],
    [
      '@vuepress/active-header-links',
      {
        sidebarLinkSelector: '.sidebar-link',
        headerAnchorSelector: '.header-anchor',
      },
    ],
    // ['@vuepress-reco/comments', {
    //   solution: 'valine',
    //   options: {
    //     appId: 'exgBe08buReYEEENkBp3sTUa-gzGzoHsz', // your appId
    //     appKey: 'AK4S2shgWknWU3SeEAoVOCWA', // your appKey
    //   }
    // }]
  ],
}
