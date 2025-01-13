# Naive Bayes

Welcome to the first assignment of the course Probability and Statistics for Machine Learning and Data Science, which is the last course in the Math for Machine Learning and Data Science specialization!

In this assignment you will implement the Naive Bayes algorithm for a spam detection problem, as you saw in the lectures. The Sections 1 - 3 provide useful context on the problem. In Section 4 you will write functions to actually implement the algorithm. Section 5 includes some interesting ungraded extensions.

# Outline
- [ 1 - Introduction](#1)
- [ 2 - Necessary imports](#2)
- [ 3 - The Dataset](#3)
  - [ 3.1 Loading and Exploring the Dataset](#3.1)
  - [ 3.2 Preprocessing the dataset](#3.2)
  - [ 3.3 Preprocessing the text](#3.3)
  - [ 3.4 Splitting into train/test](#3.4)
- [ 4 - Implementing the Naive Bayes Algorithm](#4)
  - [ 4.1 Computing $P(\text{email} \mid \text{spam})$ and $P(\text{email} \mid \text{ham})$](#4.1)
  - [ 4.2 Computing $P(\text{spam})$ and $P(\text{ham})$](#4.2)
  - [ 4.3 Putting all together](#4.3)
    - [ Exercise 1](#ex01)
    - [ Exercise 2](#ex02)
    - [ Exercise 3](#ex03)
    - [ Exercise 4](#ex04)
  - [ 4.4 Model performance](#4.4)
- [ 5 - Appendix (Section NOT graded)](#5)
  - [ 5.1 Hidden problem in the Naive Bayes model.](#5.1)
  - [ 5.2 Enhancing model performance: Practical implementation with Naive Bayes](#5.2)


<a name="1"></a>
## 1 - Introduction

The Naive Bayes algorithm stands as a cornerstone in Machine Learning and Data Science, leveraging Bayes' Theorem with the goal of determining whether a data point belongs to a specific class. The algorithm makes a "naive assumption" that each feature is independent of the others. This assumption almost certainly isn't true of your data, but making it leads to a significantly easier algorithm to implement and, as you'll see, can lead to impressively useful results. It's important to note that Naive Bayes is a supervised algorithm, meaning it requires data that's already labeled to function effectively. In the example you're about to see, that means it requires that a collection of emails have already been marked as "spam" or "ham" in order to train the algorithm.

### Naive Bayes for Spam Detection

This assignment focuses on a binary classification problem: distinguishing between spam and non-spam emails, colloquially referred to as "ham." For the purpose of this task, spam emails will be labeled as $1$, and non-spam (ham) emails as $0$.

The probability of interest for a given email is denoted as:

$$ P(\text{spam} \mid \text{email}) $$

The higher this probability, the more likely the email is to be classified as spam. Bayes' Theorem, which you saw in the lectures, is used in the calculation in the following way:

$$ P(\text{spam} \mid \text{email}) = \frac{P(\text{email} \mid \text{spam}) \cdot P(\text{spam})}{P(\text{email})} $$

Here's a breakdown of the terms:

- $P(\text{spam})$: Probability of a randomly selected email being spam, equivalent to the proportion of spam emails in the dataset.
- $P(\text{email} \mid \text{spam})$: Probability of a specific email occurring given that it is known to be spam.
- $P(\text{email})$: Overall probability of the email occurring.

An interesting early "shortcut" you can take in this approach is just ignore the $P(\text{email})$ term. The goal of this calculation will be to compare the probability an email is spam to the probability it is ham. Here's the expression for both $P(\text{spam} \mid \text{email})$ and $P(\text{ham} \mid \text{email})$:

$$ P(\text{spam} \mid \text{email}) = \frac{P(\text{email} \mid \text{spam}) \cdot P(\text{spam})}{P(\text{email})} $$

$$ P(\text{ham} \mid \text{email}) = \frac{P(\text{email} \mid \text{ham}) \cdot P(\text{ham})}{P(\text{email})} $$

Since $P(\text{email}) > 0$ and it appears in both expressions, comparing the two probabilities only requires evaluating the numerators and you can ignore this denominator.

<a name="2"></a>
## 2 - Necessary imports

This next codeblock will import all necessary libraries and functions you will need in the assignment as well as unit tests that will provide feedback as you work.


```python
import numpy as np
import pandas as pd
from nltk.corpus import stopwords
from nltk import word_tokenize
import string
```



```python
import w1_unittest
print(w1_unittest)
```

<a name="3"></a>
## 3 - The Dataset

<a name="3.1"></a>
### 3.1 Loading and Exploring the Dataset

The following code block will load the dataset into memory. You will utilize the [Pandas Library](https://pandas.pydata.org/docs/index.html) to read it as a Pandas [DataFrame](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.html#pandas.DataFrame), its primary object. However, **no need to worry** if you are are still getting familiar with Pandas. It will be loaded to illustrate the data structure, and you will end up with NumPy arrays for your actual work.


```python
dataframe_emails = pd.read_csv('emails.csv')
dataframe_emails.head()
# Subject: naturally irresistible your corporate...	 Subject: the stock trading gunslinger fanny i...	Subject: do not have money , get software cds ...	
```
| # | text                                              |span|
|---|---------------------------------------------------|----|
| 0 | Subject: naturally irresistible your corporate... |  1 |
| 1 | Subject: the stock trading gunslinger  fanny i... |  1 |
| 2 | Subject: unbelievable new homes made easy  im ... |  1 |
| 3 | Subject: 4 color printing special  request add... |  1 |
| 4 | Subject: do not have money , get software cds ..  |  1 |

Let's explore the dataset a bit:
```python
print(f"Number of emails: {len(dataframe_emails)}")
print(f"Proportion of spam emails: {dataframe_emails.spam.sum()/len(dataframe_emails):.4f}")
print(f"Proportion of ham emails: {1-dataframe_emails.spam.sum()/len(dataframe_emails):.4f}")
```
----
    Number of emails: 5728
    Proportion of spam emails: 0.2388
    Proportion of ham emails: 0.7612


Note that this dataset is **unbalanced**. There are more than twice as many ham emails as spam emails in it! This is useful context to know in any data analysis project and may affect how some machine learning algorithms run, including Naive Bayes.

<a name="3.2"></a>
### 3.2 Preprocessing the dataset


The DataFrame has two columns. The one called `text` has the email's contents and the second one, called `spam` has a numerical variable telling whether the email is a spam or not. Remember that $1$ means spam and $0$ means ham (not spam). This next function will complete a couple of important pre-processing steps:

* Note that every email starts with `Subject:`. This function will remove this word from the front of every email.
* It will randomly shuffle the dataset. Right now all the spam emails are at the top of the data set followed by the ham emails. You need a shuffled dataset to properly split the data between the train and test datasets.

Don't worry if you don't understand all the Python in this function, but it's included here to remind you that usually you need to explore and pre-process your data before jumping right into analysis.


```python
def preprocess_emails(df):
    """
    Preprocesses email data from a DataFrame.

    Parameters:
    - df (pandas.DataFrame): The input DataFrame containing email data with 'text' and 'spam' columns.

    Returns:
    - tuple: A tuple containing two elements:
        1. X (numpy.array): An array containing email content after removing the "Subject:" prefix.
        2. Y (numpy.array): An array indicating whether each email is spam (1) or ham (0).

    The function shuffles the input DataFrame to avoid biased results in train/test splits.
    It then extracts email content and spam labels, removing the "Subject:" prefix from each email.

    """
    # Shuffles the dataset
    df = df.sample(frac = 1, ignore_index = True, random_state = 42)
    # Removes the "Subject:" string, which comprises the first 9 characters of each email. Also, convert it to a numpy array.
    X = df.text.apply(lambda x: x[9:]).to_numpy()
    # Convert the labels to numpy array
    Y = df.spam.to_numpy()
    return X, Y
```


```python
X, Y = preprocess_emails(dataframe_emails)
```

Let's print the first $5$ emails:


```python
print([text for (i, text) in enumerate(X[:15]) if Y[i]==1])
```
----
    ['feel insecure about your penis size ?  penis growth patches are here !  http : / / www . retdehola . com / ss /  the biggest shortage of all is the shortage of common sense .  you can tell the ideals of a nation by its advertisements .  virtue has its own reward , but no box office .  the great aim of education is not knowledge but action .  beware of the young doctor and the old barber .']


And the first $5$ labels:


```python
print(Y[:15])
```
----
    [0 0 0 0 0 0 0 0 0 0 0 0 1 0 0]


Note that the numpy array `X` is an array of strings, so each element in this array is an email and the same index in this array is the index in `Y` telling whether the email is spam or not. **Try changing the value in `email_index`** to see the text of various emails and whether they're spam or not. Remember that 0 means ham and 1 means spam.


```python
email_index = 30
print(f"Email index {email_index}: {X[email_index]}\n\n")
print(f"Class: {Y[email_index]}")
```
----
    Email index 30: = setting up an office in china can be very difficult if you are not familiar with the chinese legislation and requirements of different authorities . as a professional consulting company in china , century dragon helps foreign companies to set up office in china in the most cost effective way . - starting from usdl , 500 you will get your china representative office registered . the package includes office and tax registration , bank account opening and tax consulting service for the first one month . - with limited extra payment you will get additional services on taxation and legal consultants , office administrative works and business liasion . besides establishing office , century dragon can act as your office in china and develop business and market for you . check out our website for more information . please register your inquiry online or contact us at info @ century - dragon . com , one of our representatives will contact with you shortly . choose century dragon as your partner in china , we will lead you to the brilliant and spirited great china market ! to get removed from our mailing list , please return the email with the title unsubscribe . 
    
    Class: 1


<a name="3.3"></a>
### 3.3 Preprocessing the text

This section is not covered in the lectures and there is no graded function in it. However, it is important when dealing with text and learning about this will for sure help your path in Machine Learning and Data Science!

In text, usually there are some words that don't provide much information about what the text is saying, such as prepositions, pronouns and so on. These are called **stopwords**. Since they are very common in every text, they hardly will store any meaningful information for our task. The idea is to remove all these stopwords and punctuation, so in the end you will have a simpler set of words to deal with. This is what the next function will do.

Another step is the emails **tokenization**. To tokenize is to split the email into **tokens**, which are essentially the words in it. As a result, for each email, the final result will be a numpy array consisting of every word in the email without stopwords and punctuation. 

```python
import nltk
nltk.download('stopwords')
nltk.download('punkt_tab')
```
```python
def preprocess_text(X):
    """
    Preprocesses a collection of text data by removing stopwords and punctuation.
    """
    # Make a set with the stopwords and punctuation
    stop = set(stopwords.words('english') + list(string.punctuation))
    if isinstance(X, str):
        X = np.array([X])
    # The result will be stored in a list
    X_preprocessed = []
    for i, email in enumerate(X):
        email = np.array([i.lower() for i in word_tokenize(email) if i.lower() not in stop]).astype(X.dtype)
        X_preprocessed.append(email)
    if len(X) == 1:
        return X_preprocessed[0]
    return X_preprocessed

```

```python
# This function may take a few seconds to run. Usually less than 1 minute.
X_treated = preprocess_text(X)
print('x', len(X), 'X-treated', len(X_treated), type(X_treated))
```
----
    x 5728 X-treated 5728


After the pre-processing, the text of each email has been turned into a numpy array with all the stop words removed. The example here shows how a randomly selected `email_index` value (in this case 989) looks before and after this processing step. Feel free to try out different values to see the results of this step on different emails. This cleaned up array of words for each email will be what is actually used by the algorithm.


```python
email_index = 989
print(f"Email before preprocessing: {X[email_index]}\n")
print(f"Email after preprocessing: {X_treated[email_index]}")
```

    Email before preprocessing: localized software , all languages available .  hello , we would like to offer 
    
    Email after preprocessing: ['localized' 'software' 'languages' 'available' 'hello' 'would' 'like'
     'offer']


<a name="3.4"></a>
### 3.4 Splitting into train/test

Now let's split our dataset into train and test sets. You will work with a proportion of 80/20, i.e., 80% of the data will be used for training and 20% for testing.


```python
TRAIN_SIZE = int(0.80*len(X_treated)) # 80% 4582 to train.

X_train = X_treated[:TRAIN_SIZE]
Y_train = Y[:TRAIN_SIZE]
X_test = X_treated[TRAIN_SIZE:]
Y_test = Y[TRAIN_SIZE:]
```

Remember that there about 24% of the emails are spam. It is important to check if this proportion remains roughly the same in the train and test datasets, otherwise you may build a biased algorithm.


```python
print(f"Proportion of spam in train dataset: {sum(Y_train == 1)/len(Y_train):.4f}")
print(f"Proportion of spam in test dataset: {sum(Y_test == 1)/len(Y_test):.4f}")
```
---
    Proportion of spam in train dataset: 0.2331
    Proportion of spam in test dataset: 0.2618


They are not equal, but they are very close, so it is fine! 

<a name="4"></a>
## 4 - Implementing the Naive Bayes Algorithm

Remember your task: Compare $P(\text{spam} \mid \text{email})$ and $P(\text{ham} \mid \text{email})$ to decide which one is greater. It is sufficient to compute only $P(\text{spam}) \cdot P(\text{email} \mid \text{spam})$ and $P(\text{ham}) \cdot P(\text{email} \mid \text{ham})$ to make the comparison.

<a name="4.1"></a>
### 4.1 Computing $P(\text{email} \mid \text{spam})$ and $P(\text{email} \mid \text{ham})$

两个计算都很重要, 先计算垃圾邮件.

每个邮件都是一串单词, 你的目标是计算$(list|spam)$. 

 $$\text{email} = \{\text{word}_1, \text{word}_2, \ldots, \text{word}_n \}$$    
 the computation is:

$$P(\text{email} \mid \text{spam}) = P(\text{word}_1 \mid \text{spam}) \cdot P(\text{word}_2 \mid \text{spam}) \cdots P(\text{word}_n \mid \text{spam})$$

This is where you make the **naive assumption** that leads to the name "Naive Bayes"! You will assume that each word's probability of appearing in an email is independent of each other word's probability. This assumption, of course, is false. Emails that contain the word "party" are probably more likely to include the word "invitation". Emails that contain the word "prize" are probably more likely to include the word "congratulations". By making a false assumption that these probabilities are independent, however, you gain the ability to apply the product rule. Rather than accounting for a complex set of conditional probabilities between words, you can simply assume independence and multiply a fairly simple set of conditional probabilities as shown in the expression above. Naive Bayes is built on an inaccurate assumption about your data, but as you'll see, it often yields impressive results!

Here's how you'd actually calculate the probability of $\text{word}_1$ appearing in an email, given it's spam:

$$P(\text{word}_1 \mid \text{spam}) = \frac{\text{\# spam emails with } \text{word}_1}{\text{\# spam emails}}$$
$$P(\text{词}_1 \mid \text{spam}) = \frac{\text{\# 垃圾邮件有词}_1量}{\text{\# 垃圾邮件数}}$$
Where the symbol \# means the number of elements. 

This is actually a really simple calculation. Count up how many spam emails contain $\text{word}_1$ and divide by the total number of spam emails. Iterate through every word in the dataset and repeat the process, and you're ready to calculate the overall probability of seeing any given email, given it is spam or ham. With this in mind, **your first task will be to create a dictionary named `word_frequency`, to store the frequency with which every word in the dataset appears in ham and spam emails**

#### 4.1.1 产出中的0的处理
遇到一个只出现在垃圾邮件中或从未出现在垃圾邮件中的单词可能会导致$P(word∣spam)=0$（或ham的类比），导致整个产品为0。这种情况是不可取的，因为单个单词可能使整个概率为0。为了减轻这种情况，您将从1开始计算每个单词的spam/ham出现次数。通过人为地假设每个单词至少有一个垃圾邮件和一个垃圾邮件，您消除了在计算中出现0 0的可能性。
<a name="4.2"></a>
### 4.2 Computing $P(\text{spam})$ and $P(\text{ham})$

When using Bayes Theorem, you'll also need to include the overall probability of seeing ham and spam emails. This computation is fairly easy since they are just the proportion of spam and ham emails in the dataset. 

$$P(\text{spam}) = \frac{\text{\# spam emails}}{\text{\# total emails}}$$
$$P(\text{ham}) = \frac{\text{\# ham emails}}{\text{\# total emails}}$$

<a name="4.3"></a>
### 4.3 综上

To calculate the probability an email is spam or ham, you'll just need to multiply the terms you've already calculated and compare which one is bigger.
判断email是否是垃圾邮件,只需对比以下2个值,谁更大!

- $P(\text{spam}) \cdot P(\text{email} \mid \text{spam})$
- $P(\text{ham}) \cdot P(\text{email} \mid \text{ham})$

<a name="ex01"></a>
### Exercise 1

Your task is to implement the function that generates a dictionary, recording the frequency with which each word in the dataset appears as spam (1) or ham (0).


```python
def get_word_frequency(X,Y):
    """
    Calculate the frequency of each word in a set of emails categorized as spam (1) or not spam (0).

    Parameters:
    - X (numpy.array): Array of emails, where each email is represented as a list of words.
    - Y (numpy.array): Array of labels corresponding to each email in X. 1 indicates spam, 0 indicates ham.

    Returns:
    - word_dict (dict): A dictionary where keys are unique words found in the emails, and values
      are dictionaries containing the frequency of each word for spam (1) and not spam (0) emails.
    """
    # Creates an empty dictionary
    word_dict = {}

    ### START CODE HERE ###

    num_emails = len(X)

    # Iterates over every processed email and its label
    for i in range(num_emails):
        # Get the i-th email
        email = X[i] 
        # Get the i-th label. This indicates whether the email is spam or not. 1 = None
        # The variable name cls is an abbreviation for class, a reserved word in Python.
        cls = Y[i] # np.int64(1)
        email = set(email) # 去重避免重复计算(认为无意义)
        # Iterates over every distinct word in the email
        for word in email:
            # If the word is not already in the dictionary, manually add it. Remember that you will start every word count as 1 both in spam and ham
            if word not in word_dict.keys():
                word_dict[word] = {"spam": 1, "ham": 1}
            # Add one occurrence for that specific word in the key ham if cls == 0 and spam if cls == 1. 
            if cls == 0:    
                word_dict[word]["ham"] += 1
            if cls == 1:
                word_dict[word]["spam"] += 1
    
    ### END CODE HERE ###
    return word_dict
```

```python
mock_emails = [['like','going','river'],
     ['love', 'deep', 'river'], 
     ['hate','river']
]
test_output = get_word_frequency(mock_emails, [1,0,0])
print(test_output)
{'like': {'spam': 2, 'ham': 1}, 
 'river': {'spam': 2, 'ham': 3}, 
 'going': {'spam': 2, 'ham': 1}, 
 'deep': {'spam': 1, 'ham': 2}, 
 'love': {'spam': 1, 'ham': 2}, 
 'hate': {'spam': 1, 'ham': 2}}
```

##### __Expected Output__ (the output order may vary, what is important is the values for each word)

The next block of code will test your function. Don't worry, you are not being graded yet. This will just ensure your function is working properly. If the unit test fails, you will get feedback so you can review your function before moving on to the next exercise.


```python
w1_unittest.test_get_word_frequency(get_word_frequency)
```


```python
# 训练集的词频
word_frequency = get_word_frequency(X_train,Y_train)
```

You will also need a class frequency dictionary. This wil store the total number of ham (0) and spam (1) emails are in the dataset. The following line of code will create it for you.


```python
# To count the spam and ham emails, you may just sum the respective 1 and 0 values in the training dataset, since the convention is spam = 1 and ham = 0.
class_frequency = {'ham': sum(Y_train == 0), 'spam': sum(Y_train == 1)}
class_frequency # ham: 3514, spam: 1068
```


```python
print(class_frequency)
```

To retrieve the proportion of spam in the training dataset, then you may just do:


```python
# The idea is to compute  (amount of spam emails)/(total emails).
# Since an email is either spam or ham, total emails = (amount of ham emails) + (amount of spam emails). 
proportion_spam = class_frequency['spam']/(class_frequency['ham'] + class_frequency['spam'])
print(f"The proportion of spam emails in training is: {proportion_spam:.4f}")
```

Note that this matches the value you obtained in some cells below!

<a name="ex02"></a>
### Exercise 2

In the next exercise, you will implement the function to compute $P(\text{word} \mid \text{spam})$ and $P(\text{word} \mid \text{ham})$. Since the computations are the same for both types of emails, you will create a function to compute $P(\text{word} \mid \text{class})$ where class can be either spam ($1$) or (ham) $0$.

Remember that 

$$P(\text{word}_i \mid \text{class}) = \frac{\text{\# emails in the class containing } \text{word}_i}{\text{\# emails in the given class}}$$

$$ P(A | B) = \frac{P(A ∩ B)} {P(B)}  (if P(B) > 0)$$
**Note that for now you won't worry about whether a word is present or not in the dictionary. This will be handled in later functions.**


```python
def prob_word_given_class(word, cls, word_frequency, class_frequency):
    """
    Calculate the conditional probability of a given word occurring in a specific class.

    Parameters:
    - word (str): The target word for which the probability is calculated.
    - cls (str): The class for which the probability is calculated, it may be 'spam' or 'ham'
    - word_frequency (dict): The dictionary containing the words frequency.
    - class_frequency (dict): The dictionary containing the class frequency.

    Returns:
    - float: The conditional probability of the given word occurring in the specified class.
    """
    ### START CODE HERE ###
    
    # Get the amount of times the word appears with the given class (class is stores in spam variable)
    amount_word_and_class = word_frequency[word][cls]
    p_word_given_class = amount_word_and_class/class_frequency[cls]

    ### END CODE HERE ###
    return p_word_given_class

    
```


```python
print(f"P(lottery | spam) = {prob_word_given_class('lottery', 'spam', word_frequency, class_frequency)}")
print(f"P(lottery | ham) = {prob_word_given_class('lottery', 'ham', word_frequency, class_frequency)}")
print(f"P(schedule | spam) = {prob_word_given_class('schedule', 'spam', word_frequency, class_frequency)}")
print(f"P(schedule | ham) = {prob_word_given_class('schedule', 'ham', word_frequency, class_frequency)}")
```

##### __Expected Output__ (the results may vary in the last decimal places)

```Python
P(lottery | spam) = 0.00807899461400359
P(lottery | ham) = 0.0002883506343713956
P(schedule | spam) = 0.008976660682226212
P(schedule | ham) = 0.10294117647058823
```

The next block of code will test your function. Don't worry, you are not being graded yet. This will just ensure your function is working properly. If the unit test fails, you will get feedback so you can review your function before moving on to the next exercise.


```python
w1_unittest.test_prob_word_given_class(prob_word_given_class, word_frequency, class_frequency)
```

<a name="ex03"></a>
### Exercise 3

In the next exercise, you will implement the function to compute $P(\text{email} \mid \text{class})$ where class can be either spam (1) or ham (0). You will use the *naive assumption* that 

$$P(\text{email} \mid \text{class}) = P(\text{word}_1 \mid \text{class}) \cdot P(\text{word}_2 \mid \text{class}) \cdots P(\text{word}_n \mid \text{class})$$

The idea is to iterate over every word in the email and in each step, update the probability by multiplying it with the value for $P(\text{word} \mid \text{class})$.

Remember that, in Python, to update values, instead of using `value = value * update`, you may just use `value *= update`. They perform exactly the same computation.


```python
def prob_email_given_class(treated_email, cls, word_frequency, class_frequency):
    """
    Calculate the probability of an email being of a certain class (e.g., spam or ham) based on treated email content.

    Parameters:
    - treated_email (list): A list of treated words in the email.
    - cls (str): The class label for the email. It can be either 'spam' or 'ham'
    - word_frequency (dict): The dictionary containing the words frequency.
    - class_frequency (dict): The dictionary containing the class frequency.
    """

    # prob starts at 1 by multiply it with the current P(word | class) in iteration
    prob = 1

    ### START CODE HERE ###

    for word in treated_email:
        # Only perform the computation for words that exist in the word frequency dictionary
        if word in word_frequency.keys(): 
            # Update the prob by multiplying it with P(word | class). Don't forget to add the word_frequency and class_frequency parameters!
            prob *= word_frequency[word][cls] / class_frequency[cls]

    return prob
```
$$P(\text{word}_i \mid \text{class}) = \frac{\text{\# emails in the class containing } \text{word}_i}{\text{\# emails in the given class}}$$

$$ P(A | B) = \frac{P(A ∩ B)} {P(B)}  (if P(B) > 0)$$

```python
example_email = "Click here to win a lottery ticket and claim your prize!"
treated_email = preprocess_text(example_email)
prob_spam = prob_email_given_class(treated_email, cls = 'spam', word_frequency = word_frequency, class_frequency = class_frequency)
prob_ham = prob_email_given_class(treated_email, cls = 'ham', word_frequency = word_frequency, class_frequency = class_frequency)
print(f"Email: {example_email}\nEmail after preprocessing: {treated_email}\nP(email | spam) = {prob_spam}\nP(email | ham) = {prob_ham}")
```

##### __Expected Output__ (the results may vary in the last decimal places)

```Python
Email: Click here to win a lottery ticket and claim your prize!
Email after preprocessing: ['click' 'win' 'lottery' 'ticket' 'claim' 'prize']
P(email | spam) = 5.3884806600117164e-11
P(email | ham) = 1.2428344868918976e-15
```

The next block of code will test your function. Don't worry, you are not being graded yet. This will just ensure your function is working properly. If the unit test fails, you will get feedback so you can review your function before moving on to the next exercise.


```python
w1_unittest.test_prob_email_given_class(prob_email_given_class, word_frequency, class_frequency)
```

<a name="ex04"></a>
### Exercise 4

In this exercise you will perform both computations below to calculate the probability an email is either spam or ham:

- $ P(\text{spam}) \cdot P(\text{email} \mid \text{spam}) $

- $ P(\text{ham}) \cdot P(\text{email} \mid \text{ham})$

The one with the greatest value will be the class your algorithm assigns to that email. Note that the function below includes a parameter that tells the function to return both probabilities rather than the class that was chosen.

**Note**: You will notice that the output will be an integer, indicating the respective email class. It would be possible to return spam if the email is predicted as spam and ham if the email is predicted as ham, however, having the model output a number helps further computation, such as metrics to evaluate the model performance.


```python
def naive_bayes(treated_email, word_frequency, class_frequency, return_likelihood = False):    
    """
    Naive Bayes classifier for spam detection.

    This function calculates the probability of an email being spam (1) or ham (0)
    based on the Naive Bayes algorithm. It uses the conditional probabilities of the
    treated_email given spam and ham, as well as the prior probabilities of spam and ham
    classes. The final decision is made by comparing the calculated probabilities.

    Parameters:
    - treated_email (list): A preprocessed representation of the input email.
    - word_frequency (dict): The dictionary containing the words frequency.
    - class_frequency (dict): The dictionary containing the class frequency.
        - return_likelihood (bool): If true, it returns the likelihood of both spam and ham.

    Returns:
    If return_likelihood = False:
        - int: 1 if the email is classified as spam, 0 if classified as ham.
    If return_likelihood = True:
        - tuple: A tuple with the format (spam_likelihood, ham_likelihood)
    """

    ### START CODE HERE ###
    
    # Compute P(email | spam) with the function you defined just above. Don't forget to add the word_frequency and class_frequency parameters!
    prob_email_given_spam = None

    # Compute P(email | ham) with the function you defined just above. Don't forget to add the word_frequency and class_frequency parameters!
    prob_email_given_ham = None

    # Compute P(spam) using the class_frequency dictionary and using the formula #spam emails / #total emails
    p_spam = None

    # Compute P(ham) using the class_frequency dictionary and using the formula #ham emails / #total emails
    p_ham = None

    # Compute the quantity P(spam) * P(email | spam), let's call it spam_likelihood
    spam_likelihood = None * None

    # Compute the quantity P(ham) * P(email | ham), let's call it ham_likelihood
    ham_likelihood = None * None


    ### END CODE HERE ###
    
    # In case of passing return_likelihood = True, then return the desired tuple
    if return_likelihood == True:
        return (spam_likelihood, ham_likelihood)
    
    # Compares both values and choose the class corresponding to the higher value
    elif spam_likelihood >= ham_likelihood:
        return 1
    else:
        return 0
```


```python
example_email = "Click here to win a lottery ticket and claim your prize!"
treated_email = preprocess_text(example_email)

print(f"Email: {example_email}\nEmail after preprocessing: {treated_email}\nNaive Bayes predicts this email as: {naive_bayes(treated_email, word_frequency, class_frequency)}")

print("\n\n")
example_email = "Our meeting will happen in the main office. Please be there in time."
treated_email = preprocess_text(example_email)

print(f"Email: {example_email}\nEmail after preprocessing: {treated_email}\nNaive Bayes predicts this email as: {naive_bayes(treated_email, word_frequency, class_frequency)}")
```

#### __Expected Output__

```
Email: Click here to win a lottery ticket and claim your prize!
Email after preprocessing: ['click' 'win' 'lottery' 'ticket' 'claim' 'prize']
Naive Bayes predicts this email as: 1



Email: Our meeting will happen in the main office. Please be there in time.
Email after preprocessing: ['meeting' 'happen' 'main' 'office' 'please' 'time']
Naive Bayes predicts this email as: 0
```

The next block of code will test your function. Don't worry, you are not being graded yet. This will just ensure your function is working properly. If the unit test fails, you will get feedback so you can review your function before moving on to the next exercise.


```python
w1_unittest.test_naive_bayes(naive_bayes, word_frequency, class_frequency)
```

<a name="4.4"></a>
### 4.4 Model performance

This section doesn't contain any graded part as it goes beyond what you saw in the lectures. However, we recommend you read it and try to understand what is being done, since measuring a model performance is crucial when building models.

In this section you will explore the performance of the model you've just built. Recall you trained you model on 80% of the data, and randomly preserved 20% of your data as test data to test it. The natural question then, is how often the model makes a correct classification when used on your test data. To answer this question, there exists one metric called [accuracy](https://en.wikipedia.org/wiki/Accuracy_and_precision). This is a measure of how much the model predicts correctly. 

To compute the accuracy, you must:

- Count every spam email that the model correctly classifies as spam (these are called **true positives**)
- Count every ham email that the model correctly classifies as ham (these are called **true negatives**)

Finally, to get a proportion, you divide the sum of the true positives and true negatives by the total number of observations. If the model is perfect, then the accuracy would be 1, or 100%. The next code block will implement functions to make this calculation.


```python
def get_true_positives(Y_true, Y_pred):
    """
    Calculate the number of true positive instances in binary classification.

    Parameters:
    - Y_true (list): List of true labels (0 or 1) for each instance.
    - Y_pred (list): List of predicted labels (0 or 1) for each instance.

    Returns:
    - int: Number of true positives, where true label and predicted label are both 1.
    """
    # Both Y_true and Y_pred must match in length.
    if len(Y_true) != len(Y_pred):
        return "Number of true labels and predict labels must match!"
    n = len(Y_true)
    true_positives = 0
    # Iterate over the number of elements in the list
    for i in range(n):
        # Get the true label for the considered email
        true_label_i = Y_true[i]
        # Get the predicted (model output) for the considered email
        predicted_label_i = Y_pred[i]
        # Increase the counter by 1 only if true_label_i = 1 and predicted_label_i = 1 (true positives)
        if true_label_i == 1 and predicted_label_i == 1:
            true_positives += 1
    return true_positives
        
def get_true_negatives(Y_true, Y_pred):
    """
    Calculate the number of true negative instances in binary classification.

    Parameters:
    - Y_true (list): List of true labels (0 or 1) for each instance.
    - Y_pred (list): List of predicted labels (0 or 1) for each instance.

    Returns:
    - int: Number of true negatives, where true label and predicted label are both 0.
    """
    
    # Both Y_true and Y_pred must match in length.
    if len(Y_true) != len(Y_pred):
        return "Number of true labels and predict labels must match!"
    n = len(Y_true)
    true_negatives = 0
    # Iterate over the number of elements in the list
    for i in range(n):
        # Get the true label for the considered email
        true_label_i = Y_true[i]
        # Get the predicted (model output) for the considered email
        predicted_label_i = Y_pred[i]
        # Increase the counter by 1 only if true_label_i = 0 and predicted_label_i = 0 (true negatives)
        if true_label_i == 0 and predicted_label_i == 0:
            true_negatives += 1
    return true_negatives
        
```


```python
# Let's get the predictions for the test set:

# Create an empty list to store the predictions
Y_pred = []


# Iterate over every email in the test set
for email in X_test:
    # Perform prediction
    prediction = naive_bayes(email, word_frequency, class_frequency)
    # Add it to the list 
    Y_pred.append(prediction)

# Checking if both Y_pred and Y_test (these are the true labels) match in length:
print(f"Y_test and Y_pred matches in length? Answer: {len(Y_pred) == len(Y_test)}")
```


```python
# Get the number of true positives:
true_positives = get_true_positives(Y_test, Y_pred)

# Get the number of true negatives:
true_negatives = get_true_negatives(Y_test, Y_pred)

print(f"The number of true positives is: {true_positives}\nThe number of true negatives is: {true_negatives}")

# Compute the accuracy by summing true negatives with true positives and dividing it by the total number of elements in the dataset. 
# Since both Y_pred and Y_test have the same length, it does not matter which one you use.
accuracy = (true_positives + true_negatives)/len(Y_test)

print(f"Accuracy is: {accuracy:.4f}")
```

Great job! You've developed a solid Naive Bayes model, assuming each word in an email stands alone. Even with that basic approach, the model impressively reaches an accuracy of 84.82%! Well done! Now, in the next code block, go ahead and compose your own email. Now you can experiment with your model in the next code block.


```python
email = "Please meet me in 2 hours in the main building. I have an important task for you."
# email = "You win a lottery prize! Congratulations! Click here to claim it"

# Preprocess the email
treated_email = preprocess_text(email)
# Get the prediction, in order to print it nicely, if the output is 1 then the prediction will be written as "spam" otherwise "ham".
prediction = "spam" if naive_bayes(treated_email, word_frequency, class_frequency) == 1 else "ham"
print(f"The email is: {email}\nThe model predicts it as {prediction}.")
```

<a name="5"></a>
## 5 - Appendix (Section NOT graded)

The following sections are not graded but show some interesting extensions of the work you just did. Feel free to submit your work now if you like for grading, but if you want to go deeper you can check out the following sections.

<a name="5.1"></a>
### 5.1 Hidden problem in the Naive Bayes model.

A hidden problem in the current model is impacting its performance. Let's delve into the issue by manually performing the Naive Bayes computation on a specific example.


```python
example_index = 4798
example_email = X[example_index]
treated_email = preprocess_text(example_email)
print(f"The email is:\n\t{example_email}\n\nAfter preprocessing:\n\t:{treated_email}")
```

Let's compute $P(\text{spam}) \cdot P(\text{email} \mid \text{spam})$ and $P(\text{ham}) \cdot P(\text{email} \mid \text{ham})$  in this case. You can do it by passing the argument `return_likelihood = True` in the `naive_bayes` function.


```python
spam_likelihood, ham_likelihood = naive_bayes(treated_email, word_frequency = word_frequency, class_frequency = class_frequency, return_likelihood = True)
print(f"spam_likelihood: {spam_likelihood}\nham_likelihood: {ham_likelihood}")
```

This is weird, both spam and ham likelihood are $0$! How can it be possible? By the way, by the actual rule, the model classifies as 1 (spam) if $\text{spam\_likelihood} \geq \text{ham\_likelihood}$, so this email would be classified as spam. Let's compare the true and predicted labels. 


```python
print(f"The example email is labeled as: {Y[example_index]}")
print(f"Naive bayes model classifies it as: {naive_bayes(treated_email, word_frequency, class_frequency)}")
```

So, this is an email that would be incorrectly sent to the spam folder! However, note that this behavior is peculiar because both likelihoods are $0$. How can it be possible? The answer lies in the math behind it!

Consider the main computation for Naive Bayes:

$$P(\text{email} \mid \text{spam}) = P(\text{word}_1 \mid \text{spam}) \cdot P(\text{word}_2 \mid \text{spam}) \cdots P(\text{word}_n \mid \text{spam})$$

It is a product of **every** word in the email.


```python
print(f"The example email has: {len(treated_email)} words in the product.")
```

So the email you are investigating has $2657$ words! Let's compute the value $P(\text{word} \mid \text{ham})$ for the first 3 words in the email:


```python
for i in range(3):
    word = treated_email[i]
    p_word_given_ham = prob_word_given_class(word, cls = 'ham', word_frequency = word_frequency, class_frequency = class_frequency)
    print(f"Word: {word}. P({word} | ham) = {p_word_given_ham}")
```

Given that they are all probabilities, they are numbers between $0$ and $1$. So, the product being performed is a product of $2657$ numbers between $0$ and $1$. In the best-case scenario, where every word has a probability in the magnitude of $10^{-1}$ (similar to the first word in the example above), the resulting probability would be in the magnitude of $10^{-2657}$—a **very small number** that is challenging for any computer to handle with precision. Let's examine Python's limit on floating-point numbers (decimal numbers):


```python
import sys

print(sys.float_info)
```

As you can see, the minimum float value has a magnitude of $10^{-308}$, significantly larger than $10^{-2657}$. Consequently, Python interprets the result of the product as $0$ at some point, leading to the loss of all information. In other words, the way your algorithm is currently written, past a certain length, all emails are being classified as spam. Given the nature of this issue, rooted in the very large product required by Naive Bayes, it is crucial to address the problem.

#### 5.1.1 The Underflow Problem

The challenge you encounter is termed an **underflow problem**, indicating that you are dealing with exceedingly small numbers beyond the computer's precision. In this case, the root cause is the **very large product** involved in Naive Bayes calculations. Fortunately, there is a solution to this issue.

Recall that in Naive Bayes, the specific values of probabilities are not critical since the algorithm solely **compares values**. This is why the denominators in the following equations have been disregarded:

$$ P(\text{spam} \mid \text{email}) = \frac{P(\text{spam}) \cdot P(\text{email} \mid \text{spam})}{P(\text{email})} $$
$$ P(\text{ham} \mid \text{email}) = \frac{P(\text{ham}) \cdot P(\text{email} \mid \text{ham})}{P(\text{email}) } $$

Given that the goal is to identify the greater value between the two, and they share the same positive denominator, only the numerators matter. Specifically, the actual values of these two products:

$$P(\text{spam}) \cdot P(\text{email} \mid \text{spam})$$
$$P(\text{ham}) \cdot P(\text{email} \mid \text{ham})$$

are irrelevant, as long as you can tell which one is larger than the other.

If there exists a function that can be applied to these quantities and **preserves the ordering**, then comparing the outputs of these values in such a function will determine the class with the maximum value (although the actual numeric value may differ). 

Any **strictly increasing function** possesses this property: it preserves the maximum **point**. Therefore, the idea is to find a **increasing function** that aids in handling the large product faced by the Naive Bayes algorithm. Can you think of one? Well, there is one: the $\log$ function. As you may already know, $\log$ can transform **products** into **sums**! Since $\log$ is increasing, it preserves the maximum point. Therefore, you can compare the following quantities:

$$\log \left(P(\text{spam}) \cdot P(\text{email} \mid \text{spam}) \right)$$
$$\log \left(P (\text{ham}) \cdot P(\text{email} \mid \text{ham}) \right)$$

And choose the maximum value among these new quantities. Denoting the class as either spam or ham:

$$\log \left(P(\text{class}) \cdot P(\text{email} \mid \text{class}) \right) = \log \left(P(\text{class}) \right) + \log \left( P(\text{email} \mid \text{class}) \right)$$

And

$$\log \left( P(\text{email} \mid \text{class}) \right) = \log  \left(P(\text{word}_1 \mid \text{class}) \cdot P(\text{word}_2 \mid \text{class}) \cdots P(\text{word}_n \mid \text{class}) \right) = \log  \left(P(\text{word}_1 \mid \text{class}) \right) + \log \left(P(\text{word}_2 \mid \text{class})\right) + \cdots + \log \left( P(\text{word}_n \mid \text{class}) \right) $$

With this approach, you have transformed a large product into a large summation, a significantly more numerically stable operation. Now, you will improve our functions with this new technique! You need to adjust two functions:

- `prob_email_given_class` - replace the probability word product by the sum of the logs
- `naive_bayes` - replace the product $P(\text{class}) \cdot P(\text{email} \mid \text{class})$ by its respective sum of log.

The new functions will be called `log_prob_email_given_class` and `log_naive_bayes`.


```python
def log_prob_email_given_class(treated_email, cls, word_frequency, class_frequency):
    """
    Calculate the log probability of an email being of a certain class (e.g., spam or ham) based on treated email content.

    Parameters:
    - treated_email (list): A list of treated words in the email.
    - cls (str): The class label ('spam' or 'ham')
    

    Returns:
    - float: The log probability of the given email belonging to the specified class.
    """

    # prob starts at 0 because it will be updated by summing it with the current log(P(word | class)) in every iteration
    prob = 0

    for word in treated_email: 
        # Only perform the computation for words that exist in the word frequency dictionary
        if word in word_frequency.keys(): 
            # Update the prob by summing it with log(P(word | class))
            prob += np.log(prob_word_given_class(word, cls,word_frequency, class_frequency))

    return prob
```


```python
# Consider an email with only one word, so it reduces to compute the value P(word | class) or log(P(word | class)).
one_word_email = ['schedule']
word = one_word_email[0]
prob_spam = prob_email_given_class(one_word_email, cls = 'spam',word_frequency = word_frequency, class_frequency = class_frequency)
log_prob_spam = log_prob_email_given_class(one_word_email, cls = 'spam',word_frequency = word_frequency, class_frequency = class_frequency)
print(f"For word {word}:\n\tP({word} | spam) = {prob_spam}\n\tlog(P({word} | spam)) = {log_prob_spam}")
```

Note that the $\text{log}$ was capable of transforming a small number into a negative number with a good magnitude. Furthermore, now the algorithm is performing a sum instead of product.

The next code block implements the log_naive_bayes.


```python
def log_naive_bayes(treated_email, word_frequency, class_frequency, return_likelihood = False):    
    """
    Naive Bayes classifier for spam detection, comparing the log probabilities instead of the actual probabilities.

    This function calculates the log probability of an email being spam (1) or ham (0)
    based on the Naive Bayes algorithm. It uses the conditional probabilities of the
    treated_email given spam and ham, as well as the prior probabilities of spam and ham
    classes. The final decision is made by comparing the calculated probabilities.

    Parameters:
    - treated_email (list): A preprocessed representation of the input email.
    - return_likelihood (bool): If true, it returns the log_likelihood of both spam and ham.

    Returns:
    - int: 1 if the email is classified as spam, 0 if classified as ham.
    """
    
    # Compute P(email | spam) with the new log function
    log_prob_email_given_spam = log_prob_email_given_class(treated_email, cls = 'spam',word_frequency = word_frequency, class_frequency = class_frequency) 

    # Compute P(email | ham) with the function you defined just above
    log_prob_email_given_ham = log_prob_email_given_class(treated_email, cls = 'ham',word_frequency = word_frequency, class_frequency = class_frequency) 

    # Compute P(spam) using the class_frequency dictionary and using the formula #spam emails / #total emails
    p_spam = class_frequency['spam']/(class_frequency['ham'] + class_frequency['spam']) 

    # Compute P(ham) using the class_frequency dictionary and using the formula #ham emails / #total emails
    p_ham = class_frequency['ham']/(class_frequency['ham'] + class_frequency['spam']) 

    # Compute the quantity log(P(spam)) + log(P(email | spam)), let's call it log_spam_likelihood
    log_spam_likelihood = np.log(p_spam) + log_prob_email_given_spam 

    # Compute the quantity P(ham) * P(email | ham), let's call it ham_likelihood
    log_ham_likelihood = np.log(p_ham) + log_prob_email_given_ham 

    # In case of passing return_likelihood = True, then return the desired tuple
    if return_likelihood == True:
        return (log_spam_likelihood, log_ham_likelihood)
    
    # Compares both values and choose the class corresponding to the higher value. 
    # As the logarithm is an increasing function, the class with the higher value retains this property.
    if log_spam_likelihood >= log_ham_likelihood:
        return 1
    else:
        return 0
```

Revisiting the example from the beginning of the section, you will compute `log_spam_likelihood` and `log_ham_likelihood`


```python
log_spam_likelihood, log_ham_likelihood = log_naive_bayes(treated_email,word_frequency = word_frequency, class_frequency = class_frequency,return_likelihood = True)
print(f"log_spam_likelihood: {log_spam_likelihood}\nlog_ham_likelihood: {log_ham_likelihood}")
```

Great! Now there are two distinct non-zero numbers! Note the higher one is the `log_ham_likelihood`, therefore the `log_naive_bayes` function will correctly predict this email as ham:


```python
print(f"The example email is labeled as: {Y[example_index]}")
print(f"Log Naive bayes model classifies it as: {log_naive_bayes(treated_email,word_frequency = word_frequency, class_frequency = class_frequency)}")
```

With this enhanced algorithm, the new accuracy is:


```python
# Let's get the predictions for the test set:

# Create an empty list to store the predictions
Y_pred = []


# Iterate over every email in the test set
for email in X_test:
    # Perform prediction
    prediction = log_naive_bayes(email,word_frequency = word_frequency, class_frequency = class_frequency)
    # Add it to the list 
    Y_pred.append(prediction)

# Get the number of true positives:
true_positives = get_true_positives(Y_test, Y_pred)

# Get the number of true negatives:
true_negatives = get_true_negatives(Y_test, Y_pred)

print(f"The number of true positives is: {true_positives}\nThe number of true negatives is: {true_negatives}")

# Compute the accuracy by summing true negatives with true positives and dividing it by the total number of elements in the dataset. 
# Since both Y_pred and Y_test have the same length, it does not matter which one you use.
accuracy = (true_positives + true_negatives)/len(Y_test)

print(f"The accuracy is: {accuracy:.4f}")
```

This is a **huge** improvement! You've increased the model's accuracy from 84.82% to 99.21% in the test set! An increase of almost 17%. And you haven't touched the dataset, it was an improvement purely in the **math** behind it. Powerful, right?

<a name="5.2"></a>
### 5.2 Enhancing model performance: Practical implementation with Naive Bayes

#### 5.2.1 Introduction

In this section you will use both Naive Bayes models (with and without log) you've defined above to solve a problem:

You must develop a good spam detection model to run in a specific email software. The dataset you worked with in this assignment is the email base you have from this software. You must build a method to effectively protect users from receiving spam, **but you must avoid sending ham emails to the spam folder** since it might cause a user to lose important emails. On the other hand, it is not that concerning letting pass a couple of spam emails to the inbox folder. 

#### 5.2.2 Accuracy and its limitations

Right now, what is the actual performance of the model you've developed thus far? The accuracy metric you defined above has some limitations, specially in this spam detection problem. You have seen in the beginning of the notebook that the proportion of spam emails in the dataset is 23.88%. So, if you create a rule to send **every email directly to inbox folder** it would correctly classify 76.12% of every email! So this pointless rule has an accuracy of 76.12%. 

To try to properly answer this question, you can ask yourself two questions:

- How many spam emails the algorithm correctly classifies as spam? They are called **true positives**.
- How many **ham** emails the algorithm **mistakenly classifies** as spam? They are called **false positives**. **This is the important question you must look closer.**

The first question relates to a metric called [*recall*](https://en.wikipedia.org/wiki/Precision_and_recall). To answer the first question, you must count how many spam emails there exist in the dataset and count how many of them are correctly labeled as spam by the model (true positives). This is defined as the recall:

$$\text{recall} = \frac{\text{true positives (spam emails correctly labeled as spam)}}{\text{every spam email}}$$

Another way you may see this metric being defined is by considering that a spam email will be either correctly labeled as spam (true positive) or mistakenly labeled as ham (false negative), so 

$$\text{recall} =\frac{\text{true positives}}{\text{true positives} + \text{false negatives}}$$

You will now make the recall function.


```python
def get_recall(Y_true, Y_pred):
    """
    Calculate the recall for a binary classification task.

    Parameters:
    - Y_true (array-like): Ground truth labels.
    - Y_pred (array-like): Predicted labels.

    Returns:
    - recall (float): The recall score, which is the ratio of true positives to the total number of actual positives.
    """
    # Get the total number of spam emails. Since they are 1 in the data, it suffices summing all the values in the array Y.
    total_number_spams = Y_test.sum()
    # Get the true positives
    true_positives = get_true_positives(Y_true, Y_pred)
    
    # Compute the recall
    recall = true_positives/total_number_spams
    return recall
```


```python
# Use the Naive Bayes model (standard and log versions) to classify every email in the test dataset
Y_pred_naive_bayes = []
Y_pred_log_naive_bayes = []

for email in X_test:
 prediction = naive_bayes(email,word_frequency = word_frequency, class_frequency = class_frequency)
 log_prediction = log_naive_bayes(email,word_frequency = word_frequency, class_frequency = class_frequency)
 Y_pred_naive_bayes.append(prediction)
 Y_pred_log_naive_bayes.append(log_prediction)

# Compute the recall for both models
recall_naive_bayes = get_recall(Y_test, Y_pred_naive_bayes)
recall_log_naive_bayes = get_recall(Y_test, Y_pred_log_naive_bayes)
```


```python
print(f"The proportion of spam emails the standard Naive Bayes model can correctly classify as spam (recall) is: {recall_naive_bayes:.4f}")
print(f"The proportion of spam emails the log Naive Bayes model can correctly classify as spam (recall) is: {recall_log_naive_bayes:.4f}")
```

Ok, both models perform pretty well in **detecting spams**, being able to correctly identify 98% of them! This metric tells us about the model's **sensitivity**. In other words, this metric shows us how effective the model is in detecting a spam email.

Now you are left with the second question. It is related to another metric called *[precision](https://en.wikipedia.org/wiki/Precision_and_recall)*. 

To answer the question you must look at all emails the Naive Bayes models classify as spam and, in that pool, how many are **in fact** spam? This is an important metric to look, because a model that classifies any email as spam is a model that correctly classifies 100% of the spam emails, however it is pointless! Furthermore, you must avoid sending regular emails to the spam folder, otherwise the users may lose important emails.

This question is related to what it is called **false positives**. In other words, now you are looking at how many ham emails the algorithm sends to the spam folder. In the next code block, you will build a function to compute the false positives.


```python
def get_false_positives(Y_true, Y_pred):
    """
    Calculate the number of false positives instances in binary classification.

    Parameters:
    - Y_true (list): List of true labels (0 or 1) for each instance.
    - Y_pred (list): List of predicted labels (0 or 1) for each instance.

    Returns:
    - int: Number of false positives, where true label is 0 and predicted label is 1.
    """
    
    # Both Y_true and Y_pred must match in length.
    if len(Y_true) != len(Y_pred):
        return "Number of true labels and predict labels must match!"
    n = len(Y_true)

    false_positives = 0
    # Iterate over the number of elements in the list
    for i in range(n):
        # Get the true label for the considered email
        true_label_i = Y_true[i]
        # Get the predicted (model output) for the considered email
        predicted_label_i = Y_pred[i]
        # Increase the counter by 1 only if true_label_i = 0 and predicted_label_i = 0 (false positive)
        if true_label_i == 0 and predicted_label_i == 1:
            false_positives += 1
    return false_positives
```


```python
# Count the ham emails mistakenly labeled as spam (false positives). Let's use the function get_false_positives you've seen above
 
false_positives_naive_bayes = get_false_positives(Y_test, Y_pred_naive_bayes)
false_positives_log_naive_bayes = get_false_positives(Y_test, Y_pred_log_naive_bayes)
```


```python
print(f"Number of false positives in the standard Naive Bayes model: {false_positives_naive_bayes}")
print(f"Number of false positives in the log Naive Bayes model: {false_positives_log_naive_bayes}")
```

This is a huge improvement! You went from 169 ham emails being mistakenly labeled as spam to only 4! To get a more meaningful number, you can compute the following quantity: 

- The proportion of actual spam emails (true positives) that exists in the pool of predicted spam emails. Note that the pool of predicted emails consist of **every spam email correctly labeled as spam** (true positives) and **every ham email mistakenly labeled as spam** (false positives).

This quantity is called **precision** and it is defined as:

$$\text{precision} = \frac{\text{true positives}}{\text{true positives} + \text{false positives}}$$

This metric tells you how **relevant** the output of your model is. As already discussed, a model that predicts every email as spam can correctly identify every spam email, however its output is irrelevant since it sends every ham email to the spam folder. You will now implement it.


```python
def get_precision(Y_true, Y_pred):
    """
    Calculate precision, a metric for the performance of a classification model,
    by computing the ratio of true positives to the sum of true positives and false positives.

    Parameters:
    - Y_true (list): True labels.
    - Y_pred (list): Predicted labels.

    Returns:
    - precision (float): Precision score.
    """
    # Get the true positives
    true_positives = get_true_positives(Y_true, Y_pred)
    false_positives = get_false_positives(Y_true, Y_pred)
    precision = true_positives/(true_positives + false_positives)
    return precision
```


```python
print(f"Precision of the standard Naive Bayes model: {get_precision(Y_test, Y_pred_naive_bayes):.4f}")
print(f"Precision of the log Naive Bayes model: {get_precision(Y_test, Y_pred_log_naive_bayes):.4f}")
```

The first version of the model has a precision of 59.57%. In other words, from 100 emails the model classifies as spam, only around 60 of them are in fact spam. This means that this model would send 40 ham emails to the spam folder, indicating that, even though very sensitive, it is not very reliable. 

On the other hand, the improved model has a precision of 98.42%! So from 100 emails classified as spam, only around 2 will be actually ham emails. A much more reliable output. 

Congratulations! You have completed the entire assignment and the appendix section! 
