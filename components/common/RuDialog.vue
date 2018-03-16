<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">

        <header class="modal-card-head">
          <p class="modal-card-title">{{ title }}</p>
          <button @click="closeCallback" class="delete" aria-label="close"></button>
        </header>

        <section class="modal-card-body">
          <slot>
            default body
          </slot>
        </section>

        <footer class="modal-card-foot">
          <slot name="footer">
            default footer
          </slot>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'RuDialog',
    props: {
      title: {
        type: String,
        default: ''
      },
      closeCallback: {
        type: Function,
        require: true
      }
    }
  };
</script>

<style scoped lang="scss">
  .modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 640px;
  margin: 0px auto;
  padding: 0px 0px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header {
  text-align: left;
}

.modal-body {
  text-align: center;
}

.modal-default-button {
  float: right;
}

.float-buttons {
  float: right;
}
</style>
