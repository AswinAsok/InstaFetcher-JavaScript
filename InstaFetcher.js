const Instagram = require("instagram-web-api");
const FileCookieStore = require("tough-cookie-filestore2");

const username = process.env['USERNAME']
const password = process.env['PASSWORD']

const cookieStore = new FileCookieStore("./cookies.json");
const client = new Instagram({ username, password, cookieStore });

(async () => {

  await client.login();
  console.log(`\n------------ Welcome to InstaFetcher --------------`)
  console.log(`----- Please Make Sure Your Profile is Public -----`)
  const user_inp = prompt("\n Enter Insta-Username:");
  const user = await client.getUserByUsername({ 
  username: user_inp });
  const userId = user.id;
  const followers = user.edge_followed_by.count;
  const followings = user.edge_follow.count;

  console.log(`\n------------ Instagram User Details ------------`)
  console.log(`\nUsername: ${user_inp}`)
  console.log(`Total Followers: ${followers}`)
  console.log(`Total Followings: ${followings}`)
  console. log('\n------------ Please Wait While the data is being fetched -------------')


  //   -------------- Followers Start --------------

  let followers_list;
  let end_cursor = "";
  let followers_array = [];

  do {
    if (followers_list && followers_list.page_info.end_cursor) {
      end_cursor = followers_list.page_info.end_cursor;
    }

    followers_list = await client.getFollowers({
      userId: userId,
      after: end_cursor,
    });

    let count = Object.keys(followers_list.data).length;

    for (let i = 0; i < count; i++) {
      followers_array.push(followers_list.data[i].username);
    }
  } while (followers_list.page_info.has_next_page);

  //   -------------- Followers End --------------

  //   -------------- Followings Start --------------

  let followings_list;
  let followings_array = [];
  end_cursor = "";

  do {
    if (followings_list && followings_list.page_info.end_cursor) {
      end_cursor = followings_list.page_info.end_cursor;
    }

    followings_list = await client.getFollowings({
      userId: userId,
      after: end_cursor,
    });

    let count = Object.keys(followings_list.data).length;

    for (let i = 0; i < count; i++) {
      followings_array.push(followings_list.data[i].username);
    }
  } while (followings_list.page_info.has_next_page);

  //   -------------- Followings End --------------

  //   -------------- Finding Non-Followers Start --------------

  let non_followers = followings_array.filter(function(obj) { return followers_array.indexOf(obj) == -1; })

  const user_inp2 = prompt("\n Do you want the list of users?(Yes/No): ");
  if(user_inp2 == "YES" || user_inp2 == "Yes" || user_inp2 == "yes"){
  console.log("\n------------------List of Non-Followers-----------\n")
  for (let i = 0; i < non_followers.length; i++) {
    console.log(`${i + 1}).${non_followers[i]}`)
  }
  }

  console.log("\nTotal Count: ", non_followers.length);

  //   -------------- Finding Non-Followers End ----------------
})();

