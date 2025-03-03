```python

import numpy as py

def problem_1_in(n_students):
	predef_bday = np.random.randint(0, 365)
	gen_bdays = np.random.randint(0, 365, (n_students))
	return predef_bday in gen_bdays

def problem_1_any(n_students):
    predef_bday = np.random.randint(0, 365)
    gen_bdays = np.random.randint(0, 365, (n_students))
    return np.any(gen_bdays == predef_bday)

def problem_1_in1d(n_students):
    predef_bday = np.random.randint(0, 365)
    gen_bdays = np.random.randint(0, 365, n_students)
    return np.in1d(predef_bday, gen_bdays)[0]  #np.in1d 返回的是ndarray
  
def problem_1_set(n_students):
    predef_bday = np.random.randint(0, 365)
    gen_bdays = np.random.randint(0, 365, (n_students))
    return predef_bday in set(gen_bdays)


import timeit
n_students = 300000
ts=10000
# 原始方法
print('in',timeit.timeit("problem_1_in", globals=globals(), number=ts))
# 使用 np.any
print('any',timeit.timeit("problem_1_any", globals=globals(), number=ts))
# 使用 np.in1d
print('in1d',timeit.timeit("problem_1_in1d", globals=globals(), number=ts))
# 使用集合
print('set',timeit.timeit("problem_1_set", globals=globals(), number=ts))
```