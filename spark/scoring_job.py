from __future__ import annotations

from pyspark.sql import DataFrame, SparkSession
from pyspark.sql import functions as F


WEIGHTS = {
    "urgency": 0.22,
    "impact_radius": 0.18,
    "cost_of_ignoring": 0.20,
    "time_sensitivity": 0.18,
    "recovery_difficulty": 0.12,
    "signal_confidence": 0.10,
}


def score_dataframe(df: DataFrame) -> DataFrame:
    """Compute the same six-dimension score at Spark scale."""
    return (
        df.withColumn(
            "problem_score",
            F.round(
                F.col("urgency") * WEIGHTS["urgency"]
                + F.col("impact_radius") * WEIGHTS["impact_radius"]
                + F.col("cost_of_ignoring") * WEIGHTS["cost_of_ignoring"]
                + F.col("time_sensitivity") * WEIGHTS["time_sensitivity"]
                + F.col("recovery_difficulty") * WEIGHTS["recovery_difficulty"]
                + F.col("signal_confidence") * WEIGHTS["signal_confidence"]
            ).cast("int"),
        )
        .withColumn(
            "action_window_days",
            F.when(F.col("problem_score") >= 90, F.lit(14))
            .when(F.col("problem_score") >= 85, F.lit(21))
            .when(F.col("problem_score") >= 78, F.lit(45))
            .when(F.col("problem_score") >= 70, F.lit(60))
            .otherwise(F.lit(90)),
        )
    )


def main() -> None:
    spark = (
        SparkSession.builder.appName("reverse-democracy-scoring")
        .config("spark.sql.shuffle.partitions", "8")
        .getOrCreate()
    )

    input_path = spark.conf.get("spark.reverse_democracy.input", "data/problem_dimensions.jsonl")
    output_path = spark.conf.get("spark.reverse_democracy.output", "data/scored_problem_objects")

    raw = spark.read.json(input_path)
    scored = score_dataframe(raw)
    scored.write.mode("overwrite").json(output_path)


if __name__ == "__main__":
    main()
