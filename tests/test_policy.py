import json
import unittest
from pathlib import Path


class RepositoryPolicyTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.policy = json.loads(Path("engineering-policy.json").read_text())

    def test_platform_pin(self):
        self.assertEqual(
            self.policy["platform"],
            {
                "repository": "JonCunninghamDev/engineering-platform",
                "version": "v1.0.0",
                "commit": "b107c9306161b395cbcaffebb55e47850b999560",
            },
        )

    def test_two_long_lived_branches(self):
        self.assertEqual(self.policy["branches"]["release"], "main")
        self.assertEqual(self.policy["branches"]["integration"], "develop")

    def test_temporary_branch_prefixes(self):
        self.assertEqual(
            self.policy["branches"]["temporary_prefixes"],
            ["feature/", "fix/", "agent/"],
        )

    def test_release_route(self):
        self.assertFalse(self.policy["delivery"]["direct_release_writes"])
        self.assertEqual(
            self.policy["delivery"]["release_route"], "integration_to_release"
        )
        self.assertEqual(self.policy["delivery"]["hotfix_route"], "integration_first")


if __name__ == "__main__":
    unittest.main()
