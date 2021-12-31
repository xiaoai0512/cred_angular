<template>
  <div :style="editorStyle"></div>
</template>
<script>
import ace from 'brace'
export default {
  props: {
    content: {
      type: String,
      required: true
    },
    lang: {
      type: String,
      default: undefined
    },
    theme: {
      type: String,
      default: undefined
    },
    width: {
      type: String,
      default: undefined
    },
    height: {
      type: String,
      default: undefined
    },
    readOnly: {
      type: Boolean
    }
  },
  data () {
    return {
      editor: null,
      currentContent: ''
    }
  },
  watch: {
    'content' (value) {
      if (this.currentContent !== value) {
        this.editor.setValue(value, 1)
      }
    }
  },
  computed: {
    editorStyle () {
      const w = this.width || '100%'
      const h = this.height || '100%'
      return `width: ${w}; height: ${h};`
    }
  },
  mounted () {
    const lang = this.lang || 'json'
    const theme = this.theme || 'github'
    require(`brace/mode/${lang}`)
    require(`brace/theme/${theme}`)
    this.editor = ace.edit(this.$el)
    this.editor.$blockScrolling = Infinity
    this.editor.setValue(this.content, 1)
    this.editor.getSession().setMode(`ace/mode/${lang}`)
    this.editor.setTheme(`ace/theme/${theme}`)
    this.editor.setOptions({
      readOnly: this.readOnly || false,
      highlightActiveLine: true,
      highlightGutterLine: true
    })
    this.editor.on('change', () => {
      this.currentContent = this.editor.getValue()
      this.$emit('change', this.currentContent)
    })
  }
}
</script>
<style>
  .json-content__ace {
    width: 100%;
    height: 100%;
    margin-left: 4px;
    flex-grow: 1;
  }
</style>
