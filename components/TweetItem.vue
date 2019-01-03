<template>
  <div class="tweet"
       @click="clicked">
    <div class="left">
      <img :src="image"
           class="avatar">
    </div>
    <div class="right">
      <div class="header">
        <span class="name">{{ user.screen_name }}</span>
        <span class="tag">@{{ user.screen_name }}</span>
        <span class="time">{{ timestamp }}</span>
      </div>
      <p class="content">
        {{ text }}
      </p>
      <!-- <div class="image">
        woeifoinconoxinfoisndfionwif
      </div> -->
      <div class="actions">
        <svg aria-hidden="true"
             data-prefix="far"
             data-icon="comment-alt"
             class="svg-inline--fa fa-comment-alt fa-w-16"
             role="img"
             xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 512 512">
          <path fill="currentColor"
                d="M448 0H64C28.7 0 0 28.7 0 64v288c0 35.3 28.7 64 64 64h96v84c0 7.1 5.8 12 12 12 2.4 0 4.9-.7 7.1-2.4L304 416h144c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64zm16 352c0 8.8-7.2 16-16 16H288l-12.8 9.6L208 428v-60H64c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16h384c8.8 0 16 7.2 16 16v288z"></path>
        </svg>
        <span class="count">{{ reply_count }}</span>
        <svg aria-hidden="true"
             data-prefix="fas"
             data-icon="sync"
             class="svg-inline--fa fa-sync fa-w-16"
             role="img"
             xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 512 512">
          <path fill="currentColor"
                d="M440.935 12.574l3.966 82.766C399.416 41.904 331.674 8 256 8 134.813 8 33.933 94.924 12.296 209.824 10.908 217.193 16.604 224 24.103 224h49.084c5.57 0 10.377-3.842 11.676-9.259C103.407 137.408 172.931 80 256 80c60.893 0 114.512 30.856 146.104 77.801l-101.53-4.865c-6.845-.328-12.574 5.133-12.574 11.986v47.411c0 6.627 5.373 12 12 12h200.333c6.627 0 12-5.373 12-12V12c0-6.627-5.373-12-12-12h-47.411c-6.853 0-12.315 5.729-11.987 12.574zM256 432c-60.895 0-114.517-30.858-146.109-77.805l101.868 4.871c6.845.327 12.573-5.134 12.573-11.986v-47.412c0-6.627-5.373-12-12-12H12c-6.627 0-12 5.373-12 12V500c0 6.627 5.373 12 12 12h47.385c6.863 0 12.328-5.745 11.985-12.599l-4.129-82.575C112.725 470.166 180.405 504 256 504c121.187 0 222.067-86.924 243.704-201.824 1.388-7.369-4.308-14.176-11.807-14.176h-49.084c-5.57 0-10.377 3.842-11.676 9.259C408.593 374.592 339.069 432 256 432z"></path>
        </svg>
        <span class="count">{{ retweet_count }}</span>
        <svg aria-hidden="true"
             data-prefix="far"
             data-icon="heart"
             class="svg-inline--fa fa-heart fa-w-16"
             role="img"
             xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 512 512">
          <path fill="currentColor"
                d="M458.4 64.3C400.6 15.7 311.3 23 256 79.3 200.7 23 111.4 15.6 53.6 64.3-21.6 127.6-10.6 230.8 43 285.5l175.4 178.7c10 10.2 23.4 15.9 37.6 15.9 14.3 0 27.6-5.6 37.6-15.8L469 285.6c53.5-54.7 64.7-157.9-10.6-221.3zm-23.6 187.5L259.4 430.5c-2.4 2.4-4.4 2.4-6.8 0L77.2 251.8c-36.5-37.2-43.9-107.6 7.3-150.7 38.9-32.7 98.9-27.8 136.5 10.5l35 35.7 35-35.7c37.8-38.5 97.8-43.2 136.5-10.6 51.1 43.1 43.5 113.9 7.3 150.8z"></path>
        </svg>
        <span class="count">{{ favorite_count }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id_str: String,
    profile: {
      default:
        'https://blog.za3k.com/wp-content/uploads/2015/03/default_profile_3.png'
    },
    timestamp_ms: String,
    name: {
      default: 'lorem ipsum'
    },
    tag: {
      default: 'lorem ipsum'
    },
    created_at: {
      default: 'Jul 25'
    },
    text: {
      default:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
    },
    reply_count: {
      default: 0
    },
    retweet_count: {
      default: 0
    },
    favorite_count: {
      default: 0
    },
    user: Object,
    retweeted_status: Object,
    quoted_status: Object
  },
  methods: {
    clicked() {
      window.open(this.link, '_blank')
    }
  },
  computed: {
    image() {
      if (this.retweeted_status && this.retweeted_status.user)
        return this.retweeted_status.user.profile_image_url_https
      else if (this.quoted_status && this.quoted_status.user)
        return this.quoted_status.user.profile_image_url_https
      else return this.profile
    },
    link() {
      return `https://twitter.com/${this.user.screen_name}/status/${
        this.id_str
      }`
    },
    timestamp() {
      return new Date(Number(this.timestamp_ms)).toLocaleString('en-US')
    }
  }
}
</script>


<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.tweet {
  display: grid;
  grid-template-columns: 58px 1fr;
  padding: 12px;
  font-size: 14px;
  border-bottom: 1px solid #e6ecf0;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  .left {
    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background-color: green;
    }
  }
  .right {
    .header {
      .name {
        color: #14171a;
        font-weight: bold;
      }
      .tag {
        color: #657786;
        margin: 0px 6px;
      }
      .time {
        color: #657786;
        &::before {
          margin-right: 6px;
          content: '\00b7';
        }
      }
    }
    .content {
      content: '\f151';
    }
    .actions {
      margin-top: 12px;
      svg {
        width: 18px;
        height: 18px;
        padding: 2px;
        color: #657786;
      }
      .count {
        color: #657786;
        display: inline-block;
        font-weight: bold;
        vertical-align: top;
        width: 52px;
        padding-left: 8px;
      }
    }
  }
}
</style>
