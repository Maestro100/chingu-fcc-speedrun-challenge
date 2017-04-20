var quoter = (function() {
  "use strict";

  // define variables and functions
  var quotes = [
    {"quote": "Well, I left the fairy tales lying on the floor of the nursery, and I have not found any books so sensible since.", "author": "G. K. Chesterton", "work": "Orthodoxy"},
    {"quote": "Angels can fly because they can take themselves lightly.", "author": "G. K. Chesterton", "work": "Orthodoxy"},
    {"quote": "Man is more himself, man is more manlike, when joy is the fundamental thing in him, and grief the superficial. Melancholy should be an innocent interlude, a tender and fugitive frame of mind; praise should be the permanent pulsation of the soul.", "author": "G. K. Chesterton", "work": "Orthodoxy"},
    {"quote": "Grown-ups never understand anything by themselves, and it is tiresome for children to be always and forever explaining things to them.", "author": "Antoine de Saint Exupéry", "work": "The Little Prince"},
    {"quote": "Nothing is more dangerous than discontinued labor; it is a habit lost. A habit easy to abandon, difficult to resume", "author": "Victor Hugo", "work": "Les Misérables"},
    {"quote": "I remember thinking, This had better be damned serious. Once I saw their faces, I regretted my wish.", "author": "Max Brooks", "work": "World War Z"},
    {"quote": "The way you see things depends a great deal on where you look at them from", "author": "Norton Juster", "work": "The Phantom Tollbooth"},
    {"quote": "Well, since you got here by not thinking, it seems reasonable to expect that, in order to get out, you must start thinking.", "author": "Norton Juster", "work": "The Phantom Tollbooth"},
    {"quote": "You certainly usually find something, if you look, but it is not always quite the something you were after", "author": "J. R. R. Tolkein", "work": "The Hobbit"},
    {"quote": "Many were increasingly of the opinion that they'd all made a big mistake in coming down from the trees in the first place. And some said that even the trees had been a bad move, and that no one should ever have left the oceans.", "author": "Douglas Adams", "work": "The Hitchhiker's Guide to the Galaxy"},
    {"quote": "Time is an illusion. Lunchtime doubly so.", "author": "Douglas Adams", "work": "The Hitchhiker's Guide to the Galaxy"},
    {"quote": "To the well-organized mind, death is but the next great adventure: filled with fun, majesty, and a bit of mischief.", "author": "J. K. Rowling", "work": "Harry Potter and the Philosopher's Stone"},
    {"quote": "The worst part of holding the memories is not the pain. It's the loneliness of it. Memories need to be shared.", "author": "Lois Lowry", "work": "The Giver"},
    {"quote": "I sometimes think drivers don't know what grass is, or flowers, because they never see them slowly.", "author": "Ray Bradbury", "work": "Fahrenheit 451"},
    {"quote": "You're afraid of making mistakes. Don't be [...] If you hid your ignorance, no one will hit you and you'll never learn.", "author": "Ray Bradbury", "work": "Fahrenheit 451"},
    {"quote": "Some men are born mediocre, some men achieve mediocrity, and some men have mediocrity thrust upon them.", "author": "Joseph Heller", "work": "Catch-22"},
    {"quote": "If you drink much from a bottle marked 'poison' it is almost certain to disagree with you, sooner or later.", "author": "Lewis Carroll", "work": "Alice in Wonderland"},
    {"quote": "An oftentimes, to win us to our harm, <br>The instruments of darkness tell us truths, <br>Win us with honest trifles, to betray's <br>In deepest consequence", "author": "William Shakespeare", "work": "Macbeth"},
    {"quote": "Of course he wasn't dead. He could never be dead until she herself had finished feeling and thinking. The kiss of his memory made pictures of love and light against the wall. Here was peace.", "author": "Zora Neale Hurston", "work": "Their Eyes Were Watching God"},
    {"quote": "Janie saw her life like a great tree in leaf with the things suffered, things enjoyed, things done and undone. Dawn and doom was in the branches.", "author": "Zora Neale Hurston", "work": "Their Eyes Were Watching God"},
    {"quote": "As an experimental psychologist, I have been trained not to believe anything unless it can be demonstrated in the laboratory on rats or sophomores.", "author": "Steven Pinker", "work": "Words and Rules: The Ingredients of Language"},
    {"quote": "It is a blessing not yet to have acquired that over-keen, diagnostic, misanthropic eye, and to be able to look at people and things trustfully when one first sees them", "author": "Stefan Zweig", "work": "Beware of Pity"},
    {"quote": "There is nothing that so raises a young man's self-esteem, that so contributes to the formation of his character as for him to find himself unexpectedly confronted with a task which he has to accomplish entirely on his own initiative and by his own efforts", "author": "Stefan Zweig", "work": "Beware of Pity"},
    {"quote": "If you are going to sell yourself, you should at least get a good price.", "author": "Stefan Zweig", "work": "Beware of Pity"},
    {"quote": "There are only two kinds of people in the end: those who say to God, \"Thy will be done,\", and those to whom God says, in the end, \"<em>Thy</em> will be done.\"", "author": "C. S. Lewis", "work": "The Great Divorce"},
    {"quote": "The most dangerous thing you can do is to take any one impulse of your own nature and set it up as the thing you ought to follow at all costs. There is not one of them which will not make us into devils if we set it up as an absolute guide.", "author": "C. S. Lewis", "work": "Mere Christianity"},
    {"quote": "<b>Education</b>, <i>n.</i> That which discloses to the wise and disguises from the foolish their lack of understanding.", "author": "Ambrose Bierce", "work": "The Devil's Dictionary"},
    {"quote": "<b>Patience</b>, <i>n.</i> A minor form of despair, disguised as virtue.", "author": "Ambrose Bierce", "work": "The Devil's Dictionary"},
    {"quote": "<b>Apologize</b>, <i>v.</i> To lay the foundation for a future offense.", "author": "Ambrose Bierce", "work": "The Devil's Dictionary"}
  ];
  var target;
  var index;
  var getQuote = function() {
    var new_index, data;
    // get new quote (do-while loop excludes duplicates)
    do {
      new_index = Math.floor(Math.random() * quotes.length);
    }
    while (index === new_index);

    // set index and get current quote object
    index = new_index;
    data = quotes[index];

    // format and return html for quote
    return "<p>" + data.quote + "</p><cite>-" +
                   data.author + "<br><i>(" +
                   data.work + ")</i></cite>";
  };
  var newQuote = function() {
    target.innerHTML = getQuote();
  };
  var tweet = function() {
    var intent = "https://twitter.com/intent/tweet";
    var quote = strip(quotes[index].quote + " - " + quotes[index].author);
    if (quote.length > 140) {
      quote = quote.slice(0, 137) + "...";
    }
    window.open(intent + "?text=" + encodeURIComponent(quote),
                "Tweet",
                "height=420,width=550");

    function strip(str) {
      return str.replace(/<\/?(?:i|b|em|br)>/g, "");
    }
  };

  // initialize quoter
  var id = document.getElementById("quoter-container");
  id.innerHTML = "<blockquote id='quoter-quote'></blockquote>" +
                 "<div id='quoter-controls'>" +
                   "<img class='btn' onclick='quoter.new()' src='128px-Refresh_icon.png'>" +
                   "<img class='btn' onclick='quoter.tweet()' src='Twitter_Logo_White_On_Blue.svg'>" +
                 "</div>";
  target = document.getElementById("quoter-quote");
  newQuote();

  // return functions for new tweet, quote
  return {
    new: newQuote,
    tweet: tweet
  };
})();
