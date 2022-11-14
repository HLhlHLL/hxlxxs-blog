<script setup lang="ts">
import { onBeforeMount, reactive, ref } from 'vue'
import { getAllDate, IDateItem } from './useDate/index'

const _date = new Date()
const currentDate = reactive({
  year: _date.getFullYear(),
  month: _date.getMonth() + 1,
  date: _date.getDate(),
  toDateString() {
    return `${this.year}-${this.month}-${this.date}`
  },
  getDate() {
    return new Date(this.year, this.month - 1, this.date)
  }
})
const allDate = ref<Array<Array<IDateItem>>>([])

const strats: Record<string, (arg?: any) => void> = {
  'pre-year': function () {
    currentDate.year--
    initDate(currentDate.getDate())
  },
  'pre-month': function (date: number) {
    if (currentDate.month-- <= 1) {
      currentDate.year--
      currentDate.month = 12
    }
    currentDate.date = 1
    date && (currentDate.date = date)
    initDate(currentDate.getDate())
  },
  'next-month': function (date: number) {
    if (currentDate.month++ >= 12) {
      currentDate.year++
      currentDate.month = 1
    }
    currentDate.date = 1
    date && (currentDate.date = date)
    initDate(currentDate.getDate())
  },
  'next-year': function () {
    currentDate.year++
    initDate(currentDate.getDate())
  }
}

const handleChangeDate = (e: Event) => {
  const type = (e.target as HTMLElement).dataset.type
  if (!type) return
  strats[type] && strats[type]()
}

const handleSelectCurrentDate = (_date: IDateItem) => {
  if (_date.currentMonth) {
    currentDate.date = _date.date.getDate()
  } else {
    const date = _date.date.getDate()
    if (date > 22) {
      strats['pre-month'](date)
    } else if (date <= 7) {
      strats['next-month'](date)
    }
  }
}

const initDate = (date: Date) => {
  allDate.value = getAllDate(date)
}

onBeforeMount(() => {
  initDate(_date)
})
</script>

<template>
  <div class="calendar">
    <div class="calendar-header" @click="handleChangeDate">
      <span
        class="pre-year iconfont icon-double-left"
        data-type="pre-year"
      ></span>
      <span class="pre-month iconfont icon-left" data-type="pre-month"></span>
      <span class="date-text">{{ currentDate.toDateString() }}</span>
      <span
        class="next-month iconfont icon-right"
        data-type="next-month"
      ></span>
      <span
        class="next-year iconfont icon-double-right"
        data-type="next-year"
      ></span>
    </div>
    <div class="calendar-body">
      <table class="calendar-table__body">
        <thead class="calendar-table-header__row">
          <th>Sun</th>
          <th>Mon</th>
          <th>Tue</th>
          <th>Wen</th>
          <th>Thu</th>
          <th>Fri</th>
          <th>Sat</th>
        </thead>
        <tbody>
          <tr v-for="(subDate, index) in allDate" :key="index">
            <td
              :class="[
                'calendar-table-body__row',
                _date.currentMonth ? 'currentMonth' : '',
                _date.currentDate ? 'currentDate' : '',
                _date.date.getDate() === currentDate.date ? 'active' : ''
              ]"
              v-for="_date in subDate"
              :key="_date.date.getTime()"
              :style="{
                backgroundColor: _date.currentMonth ? '' : '#eee',
                color: _date.currentMonth ? '' : '#999'
              }"
              @click="handleSelectCurrentDate(_date)"
            >
              {{ _date.date.getDate() }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.calendar {
  padding: 15px 0 20px;
  background-color: #fff;
  .calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-around;
    text-align: center;
    .date-text {
      font-size: 20px;
      font-weight: 600;
    }
    .pre-year,
    .next-year {
      font-weight: 700;
    }
    .iconfont {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      text-align: center;
      line-height: 20px;
      cursor: pointer;
      &:hover {
        background-color: #222;
        color: #fff;
      }
    }
  }
  .calendar-body {
    .calendar-table__body {
      width: 100%;
      text-align: center;
      border-spacing: 2px 10px;
      .calendar-table-header__row {
        font-size: 15px;
      }
      .calendar-table-body__row {
        font-size: 14px;
        border-radius: 3px;
        transition: all 0.2s linear;
        cursor: pointer;
      }
      .currentMonth:hover {
        background-color: #222;
        color: #fff;
      }
      .currentDate {
        background-color: rgba($color: #d2691e, $alpha: 0.8);
        color: #fff;
      }
      .active {
        background-color: #222;
        color: #fff;
      }
    }
  }
}
</style>
