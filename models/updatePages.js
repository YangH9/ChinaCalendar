const puppeteer = require('puppeteer')

const username = '' // gitee用户名
const password = '' // gitee密码
const giteePageUrl = 'https://gitee.com/YangH9/ChinaCalendar/pages' // gitee page地址

async function giteeUpdate(username, giteePageUrl, passwd) {
  const browser = await puppeteer.launch({
    // 此处可以使用 false 有头模式进行调试, 调试完注释即可
    // headless: false
  })
  const page = await browser.newPage()
  await page.goto('https://gitee.com/login')
  // 1. 选中账号控件
  let accountElements = await page.$x('//*[@id="user_login"]') // 此处使用 xpath 寻找控件，下同
  // 2. 填入账号
  await accountElements[0].type(username)
  // 3. 选中密码控件
  let pwdElements = await page.$x('//*[@id="user_password"]')
  // 4. 填入密码
  await pwdElements[0].type(passwd)
  // 5. 点击登录
  let loginButtons = await page.$x(
    // '//*[@id="new_user"]/div[2]/div/div/div[4]/input'
    '//*[@id="new_user"]/div/div/div/div[4]/input'
  )
  await loginButtons[0].click()
  // 6. 等待登录成功
  await page.waitForTimeout(1000)
  await page.goto(giteePageUrl)
  await page.waitForTimeout(1000)
  // 7.1. 监听步骤 7 中触发的确认弹框，并点击确认
  await page.on('dialog', async dialog => {
    console.log('确认更新')
    dialog.accept()
  })
  // 7. 点击更新按钮，并弹出确认弹窗
  let updateButtons = await page.$x('//*[@id="pages-branch"]/div[6]')
  await updateButtons[0].click()
  // 8. 轮询并确认是否更新完毕
  while (true) {
    await page.waitForTimeout(2000)
    try {
      // 8.1 获取更新状态标签
      deploying = await page.$x('//*[@id="pages_deploying"]')
      if (deploying.length > 0) {
        console.log('更新中...')
      } else {
        console.log('更新完毕')
        break
      }
    } catch (error) {
      break
    }
  }
  await page.waitForTimeout(500)
  // 10.更新完毕，关闭浏览器
  browser.close()
}

giteeUpdate(username, giteePageUrl, password)
