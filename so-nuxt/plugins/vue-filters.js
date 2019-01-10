import Vue from 'vue'
import { formatHour } from '@schools-out/helpers'

Vue.filter(`duration`, value => formatHour(value))
