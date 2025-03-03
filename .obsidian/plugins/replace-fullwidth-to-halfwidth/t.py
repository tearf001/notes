import base64

encrypted_string = "GI6s7EK3TNRTDWEeqX7GjGn6a9Xm6TTIKCprdYTAvAOwIbJ4PAffj86H/0K2v30T0+XJTReFyYkcsJ8KM1q044OkSv34RixWFQBAWXdKNGhgHu00uVoqiXB267+Ns21+TRlbJqgyYuDKMtWLkh7X7kYj60nEMKciihfINFGX0/UIW/IMxCatDAvUNtpSF/wiiYcqlhlHn8bnX9FvRqk4Dg==$$$U/tvX5LF+4KUz5nnw4VR9pawz3sVVubkHEYV9JqHjXcY6slc7Cj8I+cFlZD1Pktd3Td9bFCJPBOOel39UCbK8SWzGMowO34sH6Wx3sb//XL3pGoAQy0p4ZTVsllKznymLXCOjTgXgym2aDUutBisQpqf7q3TDA1C7aQVLVNWBiU="

try:
    part1, part2, *n = encrypted_string.split("=")
    # 尝试reverse加密
    decoded_part1 = base64.b64decode(part1).decode('utf-8')
    decoded_part2 = base64.b64decode(part2[::-1]).decode('utf-8')

    print("Decoded Part 1:", decoded_part1)
    print("Decoded Part 2:", decoded_part2)

    # 尝试将两个部分组合起来, 假设是两个部分拼接
    print("Merged String:", decoded_part1 + decoded_part2)

except Exception as e:
    print("解密失败:", e)

